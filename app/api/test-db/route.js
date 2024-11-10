import sequelize from "@/config/db";

export async function GET(req) {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');
        return new Response(JSON.stringify({ message: 'Database connected successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Database connection failed:', error);
        return new Response(JSON.stringify({ message: 'Database connection failed', error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}