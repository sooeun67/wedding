const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 이미지 최적화 설정
const OPTIMIZATION_SETTINGS = {
  // 메인 이미지 (더 높은 품질 유지)
  main: {
    quality: 80,
    maxWidth: 1080,
    maxHeight: 1920,
    format: 'jpeg'
  },
  // 갤러리 이미지 (웹 최적화)
  gallery: {
    quality: 75,
    maxWidth: 800,
    maxHeight: 800,
    format: 'jpeg'
  },
  // 썸네일 이미지 (더 작은 크기)
  thumbnail: {
    quality: 70,
    maxWidth: 400,
    maxHeight: 400,
    format: 'jpeg'
  }
};

// 백업 폴더 생성
const BACKUP_DIR = path.join(__dirname, '../public/images/backup');
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// 이미지 최적화 함수
async function optimizeImage(inputPath, outputPath, settings) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const originalSize = fs.statSync(inputPath).size;
    
    console.log(`처리 중: ${path.basename(inputPath)} (${(originalSize / 1024 / 1024).toFixed(2)}MB)`);
    
    // 임시 파일 사용 (같은 파일을 입력/출력으로 사용하는 문제 해결)
    const tempPath = outputPath + '.tmp';
    
    // 이미지 크기 조정
    let pipeline = image.resize(settings.maxWidth, settings.maxHeight, {
      fit: 'inside',
      withoutEnlargement: true
    });
    
    // JPEG 최적화
    if (settings.format === 'jpeg') {
      pipeline = pipeline.jpeg({
        quality: settings.quality,
        progressive: true,
        mozjpeg: true
      });
    }
    
    await pipeline.toFile(tempPath);
    
    // 임시 파일을 원본 파일로 교체
    fs.unlinkSync(outputPath);
    fs.renameSync(tempPath, outputPath);
    
    const optimizedSize = fs.statSync(outputPath).size;
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ 완료: ${path.basename(outputPath)} (${(optimizedSize / 1024 / 1024).toFixed(2)}MB, ${reduction}% 감소)`);
    
    return {
      originalSize,
      optimizedSize,
      reduction: parseFloat(reduction)
    };
  } catch (error) {
    console.error(`❌ 오류: ${inputPath}`, error.message);
    return null;
  }
}

// 백업 함수
function backupImage(inputPath) {
  const fileName = path.basename(inputPath);
  const backupPath = path.join(BACKUP_DIR, fileName);
  
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(inputPath, backupPath);
    console.log(`📁 백업: ${fileName}`);
  }
}

// 메인 실행 함수
async function main() {
  console.log('🚀 이미지 최적화 시작...\n');
  
  const imagesDir = path.join(__dirname, '../public/images');
  const totalStats = {
    originalSize: 0,
    optimizedSize: 0,
    processed: 0,
    failed: 0
  };
  
  // 메인 이미지들 처리
  const mainImages = ['main.jpg', 'main_2.jpg', 'ha0h-1fsi-bqt3.JPG', 'ha0h-1fsi-bqt3_2.jpg'];
  for (const imageName of mainImages) {
    const inputPath = path.join(imagesDir, imageName);
    if (fs.existsSync(inputPath)) {
      backupImage(inputPath);
      const result = await optimizeImage(inputPath, inputPath, OPTIMIZATION_SETTINGS.main);
      if (result) {
        totalStats.originalSize += result.originalSize;
        totalStats.optimizedSize += result.optimizedSize;
        totalStats.processed++;
      } else {
        totalStats.failed++;
      }
    }
  }
  
  // 갤러리 이미지들 처리
  const galleryDir = path.join(imagesDir, 'gallery');
  if (fs.existsSync(galleryDir)) {
    const galleryFiles = fs.readdirSync(galleryDir)
      .filter(file => /\.(jpg|jpeg|png)$/i.test(file));
    
    for (const fileName of galleryFiles) {
      const inputPath = path.join(galleryDir, fileName);
      backupImage(inputPath);
      
      // 큰 파일들은 갤러리 설정, 작은 파일들은 썸네일 설정 사용
      const fileSize = fs.statSync(inputPath).size;
      const settings = fileSize > 1024 * 1024 ? OPTIMIZATION_SETTINGS.gallery : OPTIMIZATION_SETTINGS.thumbnail;
      
      const result = await optimizeImage(inputPath, inputPath, settings);
      if (result) {
        totalStats.originalSize += result.originalSize;
        totalStats.optimizedSize += result.optimizedSize;
        totalStats.processed++;
      } else {
        totalStats.failed++;
      }
    }
  }
  
  // 기타 이미지들 처리
  const otherImages = ['bride-child.jpg', 'groom-child.jpg'];
  for (const imageName of otherImages) {
    const inputPath = path.join(imagesDir, imageName);
    if (fs.existsSync(inputPath)) {
      backupImage(inputPath);
      const result = await optimizeImage(inputPath, inputPath, OPTIMIZATION_SETTINGS.thumbnail);
      if (result) {
        totalStats.originalSize += result.originalSize;
        totalStats.optimizedSize += result.optimizedSize;
        totalStats.processed++;
      } else {
        totalStats.failed++;
      }
    }
  }
  
  // 결과 요약
  console.log('\n📊 최적화 완료!');
  console.log(`처리된 파일: ${totalStats.processed}개`);
  console.log(`실패한 파일: ${totalStats.failed}개`);
  console.log(`원본 크기: ${(totalStats.originalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`최적화 후: ${(totalStats.optimizedSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`절약된 용량: ${((totalStats.originalSize - totalStats.optimizedSize) / 1024 / 1024).toFixed(2)}MB`);
  console.log(`압축률: ${(((totalStats.originalSize - totalStats.optimizedSize) / totalStats.originalSize) * 100).toFixed(1)}%`);
  console.log(`\n💾 백업 파일 위치: ${BACKUP_DIR}`);
}

// 스크립트 실행
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { optimizeImage, OPTIMIZATION_SETTINGS };
