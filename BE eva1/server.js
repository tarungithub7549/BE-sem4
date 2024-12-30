const http = require('http');
const fs = require('fs');
const qs = require('querystring');

const server = http.createServer((req, res) => {
    let { method } = req;
    console.log(`Received request: ${method} ${req.url}`);

    if (method === "GET") {
        if (req.url === "/") {
            console.log("Inside / route (GET request)");
            fs.readFile("User.json", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(data);
                }
            });
        } else if (req.url === "/register") {
            fs.readFile("register.html", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    res.end(data);
                }
            });
        } else {
            res.writeHead(404);
            res.end("Not Found");
        }
    } else if (method === "POST" && req.url === "/register") {
        console.log("Inside /register route (POST request)");

        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            let readdata = fs.readFileSync("User.json", "utf-8");

            // Initialize User.json if it does not exist or is empty
            if (!readdata) {
                fs.writeFileSync("User.json", JSON.stringify([]));
                readdata = "[]"; // Initialize as empty array if file is empty
            }

            let jsonData = JSON.parse(readdata);
            let users = jsonData; // Use existing data or an empty array

            // Decode the form data
            let convertedBody = qs.decode(body);

            // Check if email and password are present
            if (!convertedBody.email || !convertedBody.password) {
                res.writeHead(400, { "Content-Type": "text/html" });
                return res.end("Email and password are required.");
            }

            // Add the new user to the users array
            users.push({
                email: convertedBody.email,
                password: convertedBody.password,
            });

            // Write updated users list back to User.json
            fs.writeFile("User.json", JSON.stringify(users, null, 2), (err) => {
                if (err) {
                    console.error("Error writing to User.json", err);
                    res.writeHead(500, { "Content-Type": "text/html" });
                    return res.end("Server Error while saving user data.");
                } else {
                    console.log("User data inserted successfully");
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end("Registration successful!");
                }
            });
        });
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});
