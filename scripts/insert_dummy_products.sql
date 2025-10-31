-- Insert dummy products for P2P marketplace testing
-- Schema: id (uuid), name (text), description (text), price (numeric), image_url (text), seller_address (text), status (text)

INSERT INTO products (name, description, price, image_url, seller_address, status) 
VALUES 
  (
    'Gaming Laptop RTX 4080',
    'High-performance gaming laptop with NVIDIA RTX 4080, 32GB RAM, 1TB SSD',
    2.5,
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000',
    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    'active'
  ),
  (
    'Professional Camera Kit',
    'Sony A7 IV with 24-70mm f/2.8 lens, includes extra battery and SD card',
    1.8,
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000',
    '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    'active'
  ),
  (
    'Limited Edition Sneakers',
    'Rare collectible sneakers, size US 10, never worn, original box',
    0.5,
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000',
    '0x2468ace02468ace02468ace02468ace02468ace02468ace02468ace02468ace0',
    'active'
  ),
  (
    'Smart Home Bundle',
    'Complete smart home set: Hub, 4 lights, 2 sensors, doorbell camera',
    0.75,
    'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1000',
    '0x1357924680abc1357924680abc1357924680abc1357924680abc1357924680ab',
    'active'
  ),
  (
    'Electric Skateboard',
    'Premium electric skateboard, 25mph top speed, 20-mile range, wireless remote',
    1.2,
    'https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&w=1000',
    '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
    'active'
  ),
  (
    'Vintage Record Player',
    'Restored 1960s turntable, built-in speakers, Bluetooth connectivity added',
    0.8,
    'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1000',
    '0x13579bdf13579bdf13579bdf13579bdf13579bdf13579bdf13579bdf13579bdf',
    'active'
  ),
  (
    'Gaming Console Bundle',
    'Latest gen console with 2 controllers and 3 popular games',
    1.5,
    'https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=1000',
    '0x24680ace24680ace24680ace24680ace24680ace24680ace24680ace24680ace',
    'active'
  ),
  (
    'Drone with 4K Camera',
    'Professional drone, 30min flight time, obstacle avoidance, carrying case included',
    1.9,
    'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&w=1000',
    '0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210',
    'active'
  ),
  (
    'Mechanical Keyboard',
    'Custom mechanical keyboard, RGB backlight, hot-swappable switches',
    0.3,
    'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1000',
    '0x11223344556677889900112233445566778899001122334455667788990011',
    'active'
  ),
  (
    'Wireless Earbuds Pro',
    'Premium earbuds with ANC, transparency mode, 24h battery life with case',
    0.45,
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000',
    '0xaabbccddaabbccddaabbccddaabbccddaabbccddaabbccddaabbccddaabbccdd',
    'active'
  );