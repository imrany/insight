-- Add up migration script here

-- users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY, 
    email TEXT UNIQUE NOT NULL,
    type VARCHAR(10) DEFAULT 'user' not null,
    username TEXT NOT NULL,
    photo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    password TEXT
);
CREATE INDEX IF NOT EXISTS user_idx on users (id);

-- prompts table
CREATE TABLE IF NOT EXISTS prompts ( 
    id SERIAL PRIMARY KEY, 
    prompt TEXT NOT NULL, 
    response TEXT NOT NULL, 
    email TEXT NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (email) REFERENCES users(email) 
); 
CREATE INDEX IF NOT EXISTS prompt_idx ON prompts (id);