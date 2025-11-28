import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { BrandConfig } from '@/lib/types';

const BRAND_CONFIGS_FILE = path.join(process.cwd(), 'data', 'brand-configs.json');

interface BrandConfigsData {
  configs: Record<string, BrandConfig>;
  lastUpdated: string | null;
}

async function ensureFileExists() {
  try {
    await fs.access(BRAND_CONFIGS_FILE);
  } catch {
    const initialData: BrandConfigsData = {
      configs: {},
      lastUpdated: null
    };
    await fs.mkdir(path.dirname(BRAND_CONFIGS_FILE), { recursive: true });
    await fs.writeFile(BRAND_CONFIGS_FILE, JSON.stringify(initialData, null, 2));
  }
}

export async function GET() {
  try {
    await ensureFileExists();
    const data = await fs.readFile(BRAND_CONFIGS_FILE, 'utf-8');
    const parsed = JSON.parse(data) as BrandConfigsData;
    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Error reading brand configs:', error);
    return NextResponse.json(
      { error: 'Failed to read brand configs', message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { configs } = body;

    if (!configs || typeof configs !== 'object') {
      return NextResponse.json(
        { error: 'Invalid configs data' },
        { status: 400 }
      );
    }

    await ensureFileExists();

    const data: BrandConfigsData = {
      configs,
      lastUpdated: new Date().toISOString()
    };

    await fs.writeFile(BRAND_CONFIGS_FILE, JSON.stringify(data, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'Brand configs saved successfully',
      lastUpdated: data.lastUpdated
    });
  } catch (error) {
    console.error('Error saving brand configs:', error);
    return NextResponse.json(
      { error: 'Failed to save brand configs', message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const initialData: BrandConfigsData = {
      configs: {},
      lastUpdated: new Date().toISOString()
    };

    await ensureFileExists();
    await fs.writeFile(BRAND_CONFIGS_FILE, JSON.stringify(initialData, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'Brand configs cleared successfully' 
    });
  } catch (error) {
    console.error('Error clearing brand configs:', error);
    return NextResponse.json(
      { error: 'Failed to clear brand configs', message: (error as Error).message },
      { status: 500 }
    );
  }
}
