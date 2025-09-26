const sharp = require('sharp');
const fs = require('fs');

async function restoreProperOrientation() {
  const imagesToRestore = ['12.JPG', '13.JPG', '14.JPG', '15.JPG'];
  
  console.log('🔄 원본 방향 복원 및 고해상도 최적화 시작...\n');
  
  for (const imageName of imagesToRestore) {
    try {
      const backupPath = `public/images/backup/${imageName}`;
      const outputPath = `public/images/gallery/${imageName}`;
      const tempPath = `public/images/gallery/${imageName}.temp`;
      
      console.log(`🔄 처리 중: ${imageName}`);
      
      // 백업된 원본 크기 확인
      const backupMetadata = await sharp(backupPath).metadata();
      console.log(`   원본 크기: ${backupMetadata.width}x${backupMetadata.height}`);
      console.log(`   EXIF 방향: ${backupMetadata.orientation || 'none'}`);
      
      // EXIF 방향 정보를 자동으로 적용하고 고해상도로 최적화
      await sharp(backupPath)
        .rotate() // EXIF 방향 정보 자동 적용
        .resize(1600, 1600, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ 
          quality: 92, 
          progressive: true 
        })
        .toFile(tempPath);
      
      // 원본을 새 파일로 교체
      fs.renameSync(tempPath, outputPath);
      
      // 결과 확인
      const newMetadata = await sharp(outputPath).metadata();
      const newSize = fs.statSync(outputPath).size;
      console.log(`✅ 완료: ${imageName} (${newMetadata.width}x${newMetadata.height}, ${(newSize/1024/1024).toFixed(2)}MB) - EXIF 방향 자동 적용`);
      
    } catch (error) {
      console.error(`❌ 오류 ${imageName}:`, error.message);
    }
  }
  
  console.log('\n🎉 원본 방향 복원 완료!');
}

restoreProperOrientation().catch(console.error);



