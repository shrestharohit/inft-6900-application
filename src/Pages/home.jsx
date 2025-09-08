import React from 'react';

function Home() {
    return (
        <div>
            <h1>Home Page</h1>

            <section>
                <h2>Welcome to the Home Page</h2>
                <p>This is a brief introduction to the home page of our website. Here, you can find a variety of content and information about our services.</p>
            </section>

            <section>
                <h2>Our Features</h2>
                <ul>
                    <li>Feature 1: Easy navigation</li>
                    <li>Feature 2: Interactive user experience</li>
                    <li>Feature 3: High-quality content</li>
                </ul>
            </section>

            <section>
                <h2>Contact Us</h2>
                <p>If you have any questions, feel free to <a href="/contact">contact us</a>!</p>
            </section>
        </div>
    );
}

export default Home;
