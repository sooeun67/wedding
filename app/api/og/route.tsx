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
            backgroundColor: '#f8f6f0',
            position: 'relative',
          }}
        >
          {/* 왼쪽: 메인 이미지 */}
          <div
            style={{
              width: '50%',
              height: '100%',
              backgroundImage: 'url(https://ekckyj-wedding.vercel.app/images/main.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              position: 'relative',
            }}
          >
            {/* 이미지 오버레이 */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
              }}
            />
          </div>
          
          {/* 오른쪽: 텍스트 영역 */}
          <div
            style={{
              width: '50%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(248, 246, 240, 0.95)',
              padding: '40px',
              position: 'relative',
            }}
          >
            <h1
              style={{
                fontSize: '36px',
                fontWeight: 'bold',
                margin: '0 0 20px 0',
                color: '#2c2c2c',
                textAlign: 'center',
                lineHeight: '1.2',
              }}
            >
              {weddingConfig.meta.title}
            </h1>
            
            <p
              style={{
                fontSize: '20px',
                margin: '0 0 15px 0',
                color: '#666',
                textAlign: 'center',
                fontWeight: '500',
              }}
            >
              {weddingConfig.main.date}
            </p>
            
            <p
              style={{
                fontSize: '16px',
                margin: '0',
                color: '#888',
                textAlign: 'center',
                lineHeight: '1.4',
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
