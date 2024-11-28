document.addEventListener('DOMContentLoaded', () => {
    // Get the buttons and boxes
    const showRegisterBtn = document.getElementById('showRegister');
    const showLoginBtn = document.getElementById('showLogin');
    const loginBox = document.getElementById('loginBox');
    const registerBox = document.getElementById('registerBox');

    // Toggle between login and register forms
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginBox.classList.add('hidden');
            registerBox.classList.remove('hidden');
        });
    }

    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerBox.classList.add('hidden');
            loginBox.classList.remove('hidden');
        });
    }

    // Check if Firebase is properly initialized
    if (!firebase.apps.length) {
        console.error('Firebase not initialized!');
        return;
    }

    firebase.auth().onAuthStateChanged((user) => {
        const navItems = document.querySelector('.nav-items');
        const existingAuthButton = navItems.querySelector('.auth-button');
        const existingProfileButton = navItems.querySelector('.profile-button');
        
        // Remove existing auth elements
        if (existingAuthButton) existingAuthButton.remove();
        if (existingProfileButton) existingProfileButton.remove();

        if (user) {
            // Create profile button with dropdown
            const profileContainer = document.createElement('div');
            profileContainer.className = 'profile-container';
            
            const profileButton = document.createElement('div');
            profileButton.className = 'profile-button';
            
            // Set profile image
            const profileImg = document.createElement('img');
            profileImg.src = user.photoURL || 'images/default-avatar.png'; // Add a default avatar image
            profileImg.alt = 'Profile';
            profileButton.appendChild(profileImg);

            // Create dropdown
            const dropdown = document.createElement('div');
            dropdown.className = 'profile-dropdown';
            dropdown.innerHTML = `
                <a href="#" class="profile-dropdown-item" id="changeAvatar">
                    <i class="fas fa-camera"></i>
                    Change Avatar
                </a>
                <a href="#" class="profile-dropdown-item" id="logout">
                    <i class="fas fa-sign-out-alt"></i>
                    Logout
                </a>
            `;

            profileContainer.appendChild(profileButton);
            profileContainer.appendChild(dropdown);
            navItems.appendChild(profileContainer);

            // Toggle dropdown
            profileButton.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                dropdown.classList.remove('show');
            });

            // Handle avatar change
            const changeAvatarBtn = dropdown.querySelector('#changeAvatar');
            changeAvatarBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        // Upload to Firebase Storage
                        const storageRef = firebase.storage().ref();
                        const avatarRef = storageRef.child(`avatars/${user.uid}`);
                        
                        avatarRef.put(file).then(() => {
                            return avatarRef.getDownloadURL();
                        }).then((url) => {
                            // Update profile
                            return user.updateProfile({
                                photoURL: url
                            });
                        }).then(() => {
                            profileImg.src = user.photoURL;
                        }).catch(console.error);
                    }
                };
                input.click();
            });

            // Handle logout
            const logoutBtn = dropdown.querySelector('#logout');
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                firebase.auth().signOut().then(() => {
                    localStorage.clear();
                    window.location.href = 'login.html';
                }).catch(console.error);
            });

        } else {
            // Show login button if not on login page
            if (!window.location.pathname.includes('login.html')) {
                const loginButton = document.createElement('a');
                loginButton.href = 'login.html';
                loginButton.className = 'auth-button';
                loginButton.textContent = 'Login';
                navItems.appendChild(loginButton);
            }
        }
    });

    // Profile picture preview functionality
    const profilePicInput = document.getElementById('profilePicture');
    const profilePreview = document.getElementById('profilePreview');
    const profilePreviewContainer = document.querySelector('.profile-preview');

    if (profilePreviewContainer) {
        profilePreviewContainer.addEventListener('click', () => {
            profilePicInput.click();
        });
    }

    if (profilePicInput) {
        profilePicInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profilePreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Registration form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const name = document.getElementById('registerName').value;
            const profileFile = document.getElementById('profilePicture').files[0];

            try {
                // Create user account
                const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;

                // Upload profile picture
                if (profileFile) {
                    const storageRef = firebase.storage().ref();
                    const profileRef = storageRef.child(`avatars/${user.uid}`);
                    await profileRef.put(profileFile);
                    const photoURL = await profileRef.getDownloadURL();

                    // Update user profile
                    await user.updateProfile({
                        displayName: name,
                        photoURL: photoURL
                    });
                }

                // Show success modal
                const successModal = document.querySelector('.success-modal');
                successModal.classList.remove('hidden');

                // Add event listener to continue shopping button
                const continueButton = document.querySelector('.continue-shopping');
                continueButton.addEventListener('click', () => {
                    window.location.href = 'index.html';
                });

                // Automatically redirect after 3 seconds
                setTimeout(() => {
                    if (!successModal.classList.contains('hidden')) {
                        window.location.href = 'index.html';
                    }
                }, 3000);

            } catch (error) {
                console.error('Registration error:', error);
                let errorMessage = 'Registration failed. ';
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage += 'An account already exists with this email.';
                        break;
                    case 'auth/weak-password':
                        errorMessage += 'Password should be at least 6 characters.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage += 'Invalid email format.';
                        break;
                    default:
                        errorMessage += 'Please try again.';
                }
                showError(errorMessage);
            }
        });
    }
});

// Logout function
function logout() {
    firebase.auth().signOut().then(() => {
        // Clear localStorage
        localStorage.clear();
        // Redirect to login
        window.location.href = 'login.html';
    }).catch((error) => {
        console.error('Error signing out:', error);
    });
}

// Add after the onAuthStateChanged listener
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Show success modal
                    const successModal = document.querySelector('.login-success-modal');
                    successModal.classList.remove('hidden');

                    // Add event listener to continue shopping button
                    const continueButton = document.querySelector('.continue-shopping');
                    continueButton.addEventListener('click', () => {
                        window.location.href = 'index.html';
                    });

                    // Automatically redirect after 3 seconds if button not clicked
                    setTimeout(() => {
                        if (!successModal.classList.contains('hidden')) {
                            window.location.href = 'index.html';
                        }
                    }, 3000);
                })
                .catch((error) => {
                    console.error('Login error:', error);
                    let errorMessage = 'Login failed. ';
                    switch (error.code) {
                        case 'auth/user-not-found':
                            errorMessage += 'No account exists with this email.';
                            break;
                        case 'auth/wrong-password':
                            errorMessage += 'Incorrect password.';
                            break;
                        case 'auth/invalid-email':
                            errorMessage += 'Invalid email format.';
                            break;
                        default:
                            errorMessage += 'Please try again.';
                    }
                    showError(errorMessage);
                });
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Show success modal
                    const successModal = document.querySelector('.success-modal');
                    successModal.classList.remove('hidden');

                    // Add event listener to continue shopping button
                    const continueButton = document.querySelector('.continue-shopping');
                    continueButton.addEventListener('click', () => {
                        window.location.href = 'index.html';
                    });

                    // Automatically redirect after 3 seconds if button not clicked
                    setTimeout(() => {
                        if (!successModal.classList.contains('hidden')) {
                            window.location.href = 'index.html';
                        }
                    }, 3000);
                })
                .catch((error) => {
                    console.error('Registration error:', error);
                    let errorMessage = 'Registration failed. ';
                    switch (error.code) {
                        case 'auth/email-already-in-use':
                            errorMessage += 'An account already exists with this email.';
                            break;
                        case 'auth/weak-password':
                            errorMessage += 'Password should be at least 6 characters.';
                            break;
                        case 'auth/invalid-email':
                            errorMessage += 'Invalid email format.';
                            break;
                        default:
                            errorMessage += 'Please try again.';
                    }
                    showError(errorMessage);
                });
        });
    }
}); 