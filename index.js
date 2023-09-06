import mysql from 'mysql2';
import 'dotenv/config';

// Create a MySQL connection
const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }

    console.log('Connected to MySQL');

    // Query to retrieve a list of all databases
    connection.query('SHOW DATABASES', (err, results) => {
        if (err) {
            console.error('Error retrieving database list:', err);
            connection.end();
            return;
        }

        // Loop through the list of databases and drop each one
        for (const row of results) {
            const dbName = row.Database;
            if (dbName !== 'information_schema' && dbName !== 'mysql' && dbName !== 'performance_schema' && dbName !== '#mysql50#lost+found' && dbName !== 'sys') {
                // Skip system databases (information_schema, mysql, performance_schema)
                connection.query(`DROP DATABASE ${dbName}`, (err) => {
                    if (err) {
                        console.error(`Error dropping database ${dbName}:`, err);
                    } else {
                        console.log(`Dropped database: ${dbName}`);
                    }
                });
            }
        }

        // Close the MySQL connection
        connection.end();
    });
});