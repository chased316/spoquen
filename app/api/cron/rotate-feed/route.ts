import { NextResponse } from 'next/server';

// This endpoint can be called by a cron job (e.g., Vercel Cron, GitHub Actions)
// to perform daily maintenance tasks at midnight

export async function GET(request: Request) {
  try {
    // Verify the request is authorized (use a secret token)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET;

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // The feed naturally resets based on date filtering
    // No manual archiving needed - Firestore queries filter by date
    
    // You could add additional logic here if needed:
    // - Send notifications about new prompts
    // - Generate analytics
    // - Clean up old data
    
    return NextResponse.json({ 
      success: true, 
      message: 'Feed rotation complete',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

