import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const PERSONALIZATIONS_FILE = path.join(process.cwd(), 'data', 'personalizations.json');

interface PersonalizationsData {
  customizations: Record<string, Record<string, unknown>>;
  lastUpdated: string | null;
}

async function ensureFileExists() {
  try {
    await fs.access(PERSONALIZATIONS_FILE);
  } catch {
    const initialData: PersonalizationsData = {
      customizations: {},
      lastUpdated: null
    };
    await fs.mkdir(path.dirname(PERSONALIZATIONS_FILE), { recursive: true });
    await fs.writeFile(PERSONALIZATIONS_FILE, JSON.stringify(initialData, null, 2));
  }
}

export async function GET() {
  try {
    await ensureFileExists();
    const data = await fs.readFile(PERSONALIZATIONS_FILE, 'utf-8');
    const parsed = JSON.parse(data) as PersonalizationsData;
    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Error reading personalizations:', error);
    return NextResponse.json(
      { error: 'Failed to read personalizations', message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customizations } = body;

    if (!customizations || typeof customizations !== 'object') {
      return NextResponse.json(
        { error: 'Invalid customizations data' },
        { status: 400 }
      );
    }

    await ensureFileExists();

    const data: PersonalizationsData = {
      customizations,
      lastUpdated: new Date().toISOString()
    };

    await fs.writeFile(PERSONALIZATIONS_FILE, JSON.stringify(data, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'Personalizations saved successfully',
      lastUpdated: data.lastUpdated
    });
  } catch (error) {
    console.error('Error saving personalizations:', error);
    return NextResponse.json(
      { error: 'Failed to save personalizations', message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const initialData: PersonalizationsData = {
      customizations: {},
      lastUpdated: new Date().toISOString()
    };

    await ensureFileExists();
    await fs.writeFile(PERSONALIZATIONS_FILE, JSON.stringify(initialData, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'Personalizations cleared successfully' 
    });
  } catch (error) {
    console.error('Error clearing personalizations:', error);
    return NextResponse.json(
      { error: 'Failed to clear personalizations', message: (error as Error).message },
      { status: 500 }
    );
  }
}
