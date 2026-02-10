// Netlify Function to handle Beehiiv subscriptions
// This proxies requests to Beehiiv's API to avoid CORS issues

exports.handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { email, publicationId } = JSON.parse(event.body);

        if (!email) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Email is required' })
            };
        }

        // Use the publication ID from the request or fall back to env var
        const pubId = publicationId || process.env.BEEHIIV_PUBLICATION_ID;
        const apiKey = process.env.BEEHIIV_API_KEY;

        if (!apiKey) {
            console.error('BEEHIIV_API_KEY not configured');
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Server configuration error' })
            };
        }

        // Subscribe to Beehiiv
        const response = await fetch(
            `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    email: email,
                    reactivate_existing: true,
                    send_welcome_email: true,
                    utm_source: 'landing_page',
                    utm_medium: 'organic',
                    referring_site: event.headers.referer || 'https://mhigrowthengine.netlify.app'
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('Beehiiv API error:', data);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: data.message || 'Subscription failed' })
            };
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ success: true, data })
        };

    } catch (error) {
        console.error('Subscribe function error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
