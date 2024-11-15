import x from 'sqlite3';
const sqlite3=x.verbose();

// Connecting Database
export const db = new sqlite3.Database("database.db" , (err) => {
    if(err){
        console.log("Error Occurred - " + err.message);
    }else{
        console.log("DataBase Connected");
    }
})


// Execute the SQL statement to create the table
function createTable(tableSql:string,tableName:string){
    db.serialize(() => {
        db.run(tableSql, function (error) {
            if (error) {
                return console.error(`Error creating ${tableName} table: ${error.message}`, error);
            }
            console.log(`${tableName} table created successfully`);
        });
    })
}

const User = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    type varchar(10) DEFAULT 'user' not null,
    username TEXT NOT NULL,
    photo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    password TEXT
)
`;
const Prompt = `
CREATE TABLE IF NOT EXISTS prompts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        prompt TEXT NOT NULL,
        response TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (email) REFERENCES users(email)
    )

`;
createTable(User,'users')
createTable(Prompt,'prompts')

// Close the database connection
// db.close((err) => {
//     if (err) {
//         return console.error(err.message);
//     }
//     console.log('Database connection closed');
// });