import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuOption.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.discountCode.deleteMany();

  // Create menu items
  const menuItems = [
    // Burgers
    {
      name: 'Classic Cheeseburger',
      description: 'Juicy beef patty with cheddar cheese, lettuce, tomato, and our special sauce',
      price: new Prisma.Decimal(12.99),
      category: 'Burgers',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      options: [
        {
          name: 'Size',
          choices: JSON.stringify([
            { name: 'Regular', priceDelta: 0 },
            { name: 'Double', priceDelta: 4 },
          ]),
          isRequired: true,
        },
        {
          name: 'Extra Toppings',
          choices: JSON.stringify([
            { name: 'Bacon', priceDelta: 2 },
            { name: 'Jalapeños', priceDelta: 1 },
            { name: 'Mushrooms', priceDelta: 1.5 },
          ]),
          isRequired: false,
          maxChoices: 3,
        },
      ],
    },
    {
      name: 'BBQ Bacon Burger',
      description: 'Smoky BBQ sauce, crispy bacon, onion rings, and melted cheddar',
      price: new Prisma.Decimal(14.99),
      category: 'Burgers',
      imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400',
      options: [
        {
          name: 'Spice Level',
          choices: JSON.stringify([
            { name: 'Mild', priceDelta: 0 },
            { name: 'Medium', priceDelta: 0 },
            { name: 'Hot', priceDelta: 0 },
          ]),
          isRequired: false,
        },
      ],
    },
    {
      name: 'Veggie Burger',
      description: 'Plant-based patty with avocado, sprouts, and tahini dressing',
      price: new Prisma.Decimal(13.49),
      category: 'Burgers',
      imageUrl: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=400',
      options: [],
    },
    // Pizza
    {
      name: 'Margherita Pizza',
      description: 'Fresh mozzarella, tomatoes, basil, and extra virgin olive oil',
      price: new Prisma.Decimal(16.99),
      category: 'Pizza',
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
      options: [
        {
          name: 'Size',
          choices: JSON.stringify([
            { name: 'Small (10")', priceDelta: 0 },
            { name: 'Medium (12")', priceDelta: 4 },
            { name: 'Large (14")', priceDelta: 7 },
          ]),
          isRequired: true,
        },
        {
          name: 'Crust',
          choices: JSON.stringify([
            { name: 'Thin', priceDelta: 0 },
            { name: 'Regular', priceDelta: 0 },
            { name: 'Stuffed', priceDelta: 3 },
          ]),
          isRequired: true,
        },
      ],
    },
    {
      name: 'Pepperoni Supreme',
      description: 'Loaded with pepperoni, Italian sausage, and mozzarella',
      price: new Prisma.Decimal(18.99),
      category: 'Pizza',
      imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
      options: [
        {
          name: 'Size',
          choices: JSON.stringify([
            { name: 'Small (10")', priceDelta: 0 },
            { name: 'Medium (12")', priceDelta: 4 },
            { name: 'Large (14")', priceDelta: 7 },
          ]),
          isRequired: true,
        },
      ],
    },
    // Salads
    {
      name: 'Caesar Salad',
      description: 'Crisp romaine, parmesan, croutons, and classic Caesar dressing',
      price: new Prisma.Decimal(10.99),
      category: 'Salads',
      imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400',
      options: [
        {
          name: 'Add Protein',
          choices: JSON.stringify([
            { name: 'Grilled Chicken', priceDelta: 4 },
            { name: 'Shrimp', priceDelta: 6 },
            { name: 'Salmon', priceDelta: 7 },
          ]),
          isRequired: false,
        },
      ],
    },
    {
      name: 'Greek Salad',
      description: 'Cucumbers, tomatoes, olives, feta cheese, and oregano vinaigrette',
      price: new Prisma.Decimal(11.49),
      category: 'Salads',
      imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
      options: [],
    },
    // Asian
    {
      name: 'Teriyaki Chicken Bowl',
      description: 'Grilled chicken with teriyaki glaze, rice, and steamed vegetables',
      price: new Prisma.Decimal(13.99),
      category: 'Asian',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      options: [
        {
          name: 'Base',
          choices: JSON.stringify([
            { name: 'White Rice', priceDelta: 0 },
            { name: 'Brown Rice', priceDelta: 1 },
            { name: 'Noodles', priceDelta: 1 },
          ]),
          isRequired: true,
        },
      ],
    },
    {
      name: 'Pad Thai',
      description: 'Rice noodles with shrimp, tofu, peanuts, and tamarind sauce',
      price: new Prisma.Decimal(14.49),
      category: 'Asian',
      imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400',
      options: [
        {
          name: 'Spice Level',
          choices: JSON.stringify([
            { name: 'Mild', priceDelta: 0 },
            { name: 'Medium', priceDelta: 0 },
            { name: 'Hot', priceDelta: 0 },
            { name: 'Thai Hot', priceDelta: 0 },
          ]),
          isRequired: false,
        },
      ],
    },
    // Drinks
    {
      name: 'Fresh Lemonade',
      description: 'Freshly squeezed lemonade with mint',
      price: new Prisma.Decimal(3.99),
      category: 'Drinks',
      imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400',
      options: [
        {
          name: 'Size',
          choices: JSON.stringify([
            { name: 'Regular', priceDelta: 0 },
            { name: 'Large', priceDelta: 1 },
          ]),
          isRequired: true,
        },
      ],
    },
    {
      name: 'Iced Coffee',
      description: 'Cold brew coffee served over ice',
      price: new Prisma.Decimal(4.49),
      category: 'Drinks',
      imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400',
      options: [],
    },
    // Desserts
    {
      name: 'Chocolate Brownie',
      description: 'Warm fudge brownie with vanilla ice cream',
      price: new Prisma.Decimal(6.99),
      category: 'Desserts',
      imageUrl: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400',
      options: [],
    },
    {
      name: 'New York Cheesecake',
      description: 'Creamy cheesecake with strawberry topping',
      price: new Prisma.Decimal(7.49),
      category: 'Desserts',
      imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400',
      options: [],
    },
  ];

  for (const item of menuItems) {
    const { options, ...itemData } = item;
    await prisma.menuItem.create({
      data: {
        ...itemData,
        options: {
          create: options,
        },
      },
    });
  }

  // Create discount codes
  const discountCodes = [
    {
      code: 'SAVE10',
      description: '10% off your order',
      discountType: 'percentage',
      discountValue: new Prisma.Decimal(10),
      minOrderValue: new Prisma.Decimal(20),
      isActive: true,
    },
    {
      code: 'FLAT5',
      description: '$5 off your order',
      discountType: 'fixed',
      discountValue: new Prisma.Decimal(5),
      minOrderValue: new Prisma.Decimal(15),
      isActive: true,
    },
    {
      code: 'WELCOME20',
      description: '20% off for new customers',
      discountType: 'percentage',
      discountValue: new Prisma.Decimal(20),
      maxUses: 100,
      usedCount: 0,
      isActive: true,
    },
    {
      code: 'SUMMER25',
      description: '25% summer discount (expired)',
      discountType: 'percentage',
      discountValue: new Prisma.Decimal(25),
      expiresAt: new Date('2025-08-31'), // Expired
      isActive: true,
    },
    {
      code: 'OLDCODE',
      description: 'Inactive promotional code',
      discountType: 'percentage',
      discountValue: new Prisma.Decimal(15),
      isActive: false, // Deactivated
    },
    {
      code: 'MAXEDOUT',
      description: 'Code that reached max uses',
      discountType: 'fixed',
      discountValue: new Prisma.Decimal(10),
      maxUses: 5,
      usedCount: 5, // Already maxed out
      isActive: true,
    },
    {
      code: 'BIGORDER',
      description: '$15 off orders over $50',
      discountType: 'fixed',
      discountValue: new Prisma.Decimal(15),
      minOrderValue: new Prisma.Decimal(50),
      isActive: true,
    },
  ];

  for (const discount of discountCodes) {
    await prisma.discountCode.create({
      data: discount,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
