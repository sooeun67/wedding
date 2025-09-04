import { ImageResponse } from 'next/og';
import { weddingConfig } from '../../../src/config/wedding-config';

export const runtime = 'edge';

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f6f0',
            backgroundImage: 'url(https://ekckyj-wedding.vercel.app/images/main.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
          }}
        >
          {/* 오버레이 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }}
          />
          
          {/* 텍스트 컨테이너 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              textAlign: 'center',
              zIndex: 1,
              padding: '40px',
            }}
          >
            <h1
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                margin: '0 0 20px 0',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              {weddingConfig.meta.title}
            </h1>
            
            <p
              style={{
                fontSize: '24px',
                margin: '0 0 20px 0',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              {weddingConfig.main.date}
            </p>
            
            <p
              style={{
                fontSize: '20px',
                margin: '0',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              {weddingConfig.main.venue}
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
