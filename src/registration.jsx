<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up</title>
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <div class="container">
        <header>
            <div class="logo">NAME LOGO</div>
            <div class="dropdown">
                <select>
                    <option value="categories">Categories</option>
                    <!-- Add categories here -->
                </select>
            </div>
            <div class="search-bar">
                <input type="text" placeholder="Search">
            </div>
        </header>
        <main>
            <div class="signup-form">
                <h1>Sign Up</h1>
                <div class="photo">
                    <img src="photo-placeholder.png" alt="User Photo">
                </div>
                <div class="form-fields">
                    <input type="text" placeholder="Full Name" required>
                    <input type="email" placeholder="Email" required>
                    <input type="password" placeholder="Password" required>
                    <div class="checkbox">
                        <input type="checkbox" id="agree">
                        <label for="agree">I Agree</label>
                    </div>
                    <button class="create-account">Create Account</button>
                    <button class="google-btn">Continue with Google</button>
                    <p>Already have an account? <a href="#">Login</a></p>
                </div>
            </div>
        </main>
    </div>
    <script src="script.js"></script>
</body>

</html>