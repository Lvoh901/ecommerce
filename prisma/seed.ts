import { PrismaClient } from '@prisma/client'
import { products, footerContent } from './seed-data'

const prisma = new PrismaClient()

// Extended Category Data with Descriptions
const categoriesData = [
    // Merging original data logic with new descriptions.
    // Original featuredCategories in src/data only had name, from, image, link.
    // We need to merge them.
    // Let's redefine the full list here based on Categories.tsx + data/index.ts
    { name: "Backpacks", from: 1500, image: "/backpack.jpg", link: "/shop", description: "Carry your essentials in style and comfort." },
    { name: "Computers", from: 20000, image: "/computers.jpg", link: "/shop", description: "Powerful and reliable computers." },
    { name: "Computer Accessories", from: 800, image: "/computer_accessories.jpg", link: "/shop", description: "Enhance your productivity." },
    { name: "Phone Accessories", from: 800, image: "/phone_accessories.jpg", link: "/shop", description: "Upgrade your mobile experience." },
    // Adding others that were in Categories.tsx but maybe not in featuredCategories (which is fine, we want all categories in DB now)
    { name: "Earphones", from: 1000, image: "/earphones.jpg", link: "/shop", description: "Enjoy immersive sound on the go." },
    { name: "Gaming Gear", from: 3000, image: "/gaming_gear.jpg", link: "/shop", description: "Elevate your gameplay." },
    { name: "Wearables", from: 2500, image: "/wearable.jpg", link: "/shop", description: "Track your fitness and health smartly." },
    { name: "Monitors/TVs", from: 15000, image: "/monitors.jpg", link: "/shop", description: "Amazing visual displays." },
    { name: "Bluetooth Speakers", from: 2000, image: "/bluetooth_speakers.jpg", link: "/shop", description: "Enjoy wireless, high-fidelity audio." },
    { name: "Drones", from: 45000, image: "/drone.jpg", link: "/shop", description: "Capture unique perspectives." },
    { name: "Cameras", from: 35000, image: "/camera.jpg", link: "/shop", description: "Snap stunning photos and videos." },
    { name: "Furniture", from: 5000, image: "/furniture.jpg", link: "/shop", description: "Modern furniture designs for tech & living." },
];

async function main() {
    console.log('Seeding database...')

    // Clear existing data
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.uIContent.deleteMany()

    // Seed Products
    for (const product of products) {
        await prisma.product.create({
            data: {
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                image: product.image,
                subcategory: product.subcategory,
                rating: product.rating,
                reviews: product.reviews
            }
        })
    }

    // Seed Categories
    for (const cat of categoriesData) {
        await prisma.category.create({
            data: {
                name: cat.name,
                fromPrice: cat.from,
                image: cat.image,
                link: cat.link,
                description: cat.description
            }
        })
    }

    // Seed UIContent (Hero, Footer, etc.)
    await prisma.uIContent.createMany({
        data: [
            { key: "hero_title", value: "KonnectTech", group: "hero" },
            { key: "hero_subtitle", value: "High-quality gadgets & Accessories.", group: "hero" },
            { key: "hero_description", value: "Discover the latest technology trends, in-depth product reviews, and essential resources tailored to your needs. Stay informed with up-to-date information on high-quality gadgets, accessories, and smart solutions designed to enhance your lifestyle.", group: "hero" },
            { key: "btn_explore", value: "Explore", group: "hero_buttons" },
            { key: "btn_about", value: "About Us", group: "hero_buttons" },
            ...footerContent
        ]
    })

    console.log('Seeding completed.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
