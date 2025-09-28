import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/test-db - Test database connection
export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...')
    
    // Test basic database connection
    await prisma.$connect()
    console.log('Database connected successfully')
    
    // Test a simple query
    const userCount = await prisma.user.count()
    console.log('User count:', userCount)
    
    // Test TaxInput model
    const taxInputCount = await prisma.taxInput.count()
    console.log('TaxInput count:', taxInputCount)
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        userCount,
        taxInputCount,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Database connection failed:', error)
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    })
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
