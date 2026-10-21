-- Tables for reviews and products 

CREATE TABLE IF NOT EXISTS products(
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    price FLOAT NOT NULL DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS reviews(
    review_id INTEGER PRIMARY KEY AUTOINCREMENT,
    associated_product_id INTEGER NOT NULL,
    review_body TEXT,
    FOREIGN KEY (associated_product_id)
        REFERENCES products (product_id)
        ON DELETE CASCADE
);