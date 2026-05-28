-- Run after schema.sql to populate sample venues

insert into public.venues (
  id, name, city, location, price, price_amount, rating, image, tag, description, capacity, capacity_max
) values
  (
    'glass-pavilion',
    'The Glass Pavilion',
    'New York',
    'Manhattan, New York',
    '$2,400',
    2400,
    '4.98',
    'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80',
    'Wedding',
    'A luminous waterfront pavilion with floor-to-ceiling glass walls and refined minimalist interiors. Perfect for ceremonies and receptions that demand natural light and an elevated atmosphere.',
    'Up to 180 guests',
    180
  ),
  (
    'noir-studio-loft',
    'Noir Studio Loft',
    'San Francisco',
    'SoMa, San Francisco',
    '$1,850',
    1850,
    '4.92',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    'Corporate',
    'An industrial-chic loft with exposed beams, professional AV setup, and flexible seating. Ideal for product launches, brand experiences, and executive gatherings.',
    'Up to 120 guests',
    120
  ),
  (
    'cedar-hall-estate',
    'Cedar Hall Estate',
    'London',
    'Mayfair, London',
    '$3,200',
    3200,
    '5.0',
    'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80',
    'Gala',
    'A grand heritage estate with marble halls, private gardens, and white-glove concierge service. Designed for galas, charity evenings, and milestone celebrations.',
    'Up to 300 guests',
    300
  ),
  (
    'skyline-terrace',
    'Skyline Terrace',
    'Chicago',
    'Downtown, Chicago',
    '$2,100',
    2100,
    '4.95',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    'Private',
    'A rooftop terrace with panoramic city views, ambient lighting, and an intimate lounge layout. A standout choice for private dinners and exclusive social events.',
    'Up to 90 guests',
    90
  )
on conflict (id) do nothing;
