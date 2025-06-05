-- Add size column to cart_items table
ALTER TABLE cart_items ADD COLUMN size VARCHAR(20);
 
-- Update existing rows to have 'OS' as default size
UPDATE cart_items SET size = 'OS' WHERE size IS NULL; 