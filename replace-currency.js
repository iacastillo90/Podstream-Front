import fs from 'fs'
import path from 'path'

function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8')
    const originalContent = content

    // Replace € with $
    content = content.replace(/€/g, '$')

    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8')
      console.log(`✓ Updated: ${filePath}`)
      return 1
    }
    return 0
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message)
    return 0
  }
}

function walkDirectory(dir) {
  let filesUpdated = 0
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      filesUpdated += walkDirectory(filePath)
    } else if (file.endsWith('.vue')) {
      filesUpdated += replaceInFile(filePath)
    }
  }

  return filesUpdated
}

// Start from src directory
const srcPath = path.join(__dirname, 'src')
console.log('Starting currency symbol replacement...\n')
const totalUpdated = walkDirectory(srcPath)
console.log(`\n✅ Complete! Updated ${totalUpdated} files.`)
