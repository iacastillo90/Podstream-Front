#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

// Configuration
const DEFAULT_CONFIG = {
  outputDir: './docs',
  outputFileName: 'project-documentation',
  exclude: [
    'node_modules/**',
    'dist/**',
    'build/**',
    '.git/**',
    '.vscode/**',
    'coverage/**',
    '*.lock',
    '*.log',
    '.DS_Store',
    'Thumbs.db',
    '*.min.js',
    '*.min.css',
    '*.map',
  ],
  binaryExtensions: [
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.ico',
    '.svg',
    '.webp',
    '.mp4',
    '.webm',
    '.mp3',
    '.wav',
    '.woff',
    '.woff2',
    '.ttf',
    '.eot',
    '.pdf',
    '.zip',
    '.tar',
    '.gz',
  ],
  maxFileSize: 1048576, // 1MB
  includeMetadata: true,
}

// Load custom configuration if exists
function loadConfig() {
  const configPath = path.join(process.cwd(), '.documentrc.json')
  if (fs.existsSync(configPath)) {
    try {
      const customConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
      return { ...DEFAULT_CONFIG, ...customConfig }
    } catch {
      console.warn('⚠️  Error loading .documentrc.json, using default config')
      return DEFAULT_CONFIG
    }
  }
  return DEFAULT_CONFIG
}

// Check if path matches any exclusion pattern
function shouldExclude(filePath, excludePatterns) {
  const normalizedPath = filePath.replace(/\\/g, '/')

  return excludePatterns.some((pattern) => {
    // Convert glob pattern to regex
    const regexPattern = pattern
      .replace(/\./g, '\\.')
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
      .replace(/\?/g, '.')

    const regex = new RegExp(`^${regexPattern}$|/${regexPattern}$|/${regexPattern}/`)
    return regex.test(normalizedPath)
  })
}

// Check if file is binary
function isBinaryFile(filePath, binaryExtensions) {
  const ext = path.extname(filePath).toLowerCase()
  return binaryExtensions.includes(ext)
}

// Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// Traverse directory and collect files
function traverseDirectory(dir, config, projectRoot, fileList = []) {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const relativePath = path.relative(projectRoot, filePath)

    // Skip excluded paths
    if (shouldExclude(relativePath, config.exclude)) {
      return
    }

    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      traverseDirectory(filePath, config, projectRoot, fileList)
    } else if (stat.isFile()) {
      fileList.push({
        path: filePath,
        relativePath: relativePath,
        size: stat.size,
        isBinary: isBinaryFile(filePath, config.binaryExtensions),
        extension: path.extname(filePath),
      })
    }
  })

  return fileList
}

// Generate file tree structure
function generateFileTree(files) {
  const tree = {}

  files.forEach((file) => {
    const parts = file.relativePath.split(path.sep)
    let current = tree

    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = index === parts.length - 1 ? null : {}
      }
      if (current[part] !== null) {
        current = current[part]
      }
    })
  })

  function printTree(node, prefix = '') {
    const entries = Object.entries(node)
    let output = ''

    entries.forEach(([key, value], index) => {
      const isLastEntry = index === entries.length - 1
      const connector = isLastEntry ? '└── ' : '├── '
      const extension = isLastEntry ? '    ' : '│   '

      output += prefix + connector + key + '\n'

      if (value !== null) {
        output += printTree(value, prefix + extension, isLastEntry)
      }
    })

    return output
  }

  return printTree(tree)
}

// Generate documentation content
function generateDocumentation(files, config, projectRoot) {
  const projectName = path.basename(projectRoot)
  const timestamp = new Date().toISOString()
  let content = ''

  // Header
  content += '═'.repeat(80) + '\n'
  content += `  DOCUMENTACIÓN DEL PROYECTO: ${projectName}\n`
  content += '═'.repeat(80) + '\n\n'

  // Metadata
  if (config.includeMetadata) {
    content += '📋 INFORMACIÓN DEL PROYECTO\n'
    content += '─'.repeat(80) + '\n'
    content += `Nombre:           ${projectName}\n`
    content += `Ubicación:        ${projectRoot}\n`
    content += `Fecha Generación: ${new Date(timestamp).toLocaleString('es-ES')}\n`
    content += `Total Archivos:   ${files.length}\n`
    content += `Tamaño Total:     ${formatFileSize(files.reduce((sum, f) => sum + f.size, 0))}\n`
    content += '\n\n'
  }

  // File tree
  content += '📁 ESTRUCTURA DEL PROYECTO\n'
  content += '─'.repeat(80) + '\n'
  content += projectName + '/\n'
  content += generateFileTree(files, projectRoot)
  content += '\n\n'

  // Statistics
  const stats = {
    total: files.length,
    text: files.filter((f) => !f.isBinary).length,
    binary: files.filter((f) => f.isBinary).length,
    byExtension: {},
  }

  files.forEach((file) => {
    const ext = file.extension || '(sin extensión)'
    stats.byExtension[ext] = (stats.byExtension[ext] || 0) + 1
  })

  content += '📊 ESTADÍSTICAS\n'
  content += '─'.repeat(80) + '\n'
  content += `Archivos de texto:   ${stats.text}\n`
  content += `Archivos binarios:   ${stats.binary}\n`
  content += `Total:               ${stats.total}\n\n`
  content += 'Distribución por tipo:\n'
  Object.entries(stats.byExtension)
    .sort((a, b) => b[1] - a[1])
    .forEach(([ext, count]) => {
      content += `  ${ext.padEnd(20)} ${count}\n`
    })
  content += '\n\n'

  // File contents
  content += '📄 CONTENIDO DE ARCHIVOS\n'
  content += '═'.repeat(80) + '\n\n'

  const textFiles = files.filter((f) => !f.isBinary)
  let processedFiles = 0

  textFiles.forEach((file, index) => {
    content += '─'.repeat(80) + '\n'
    content += `Archivo ${index + 1}/${textFiles.length}: ${file.relativePath}\n`
    content += `Tamaño: ${formatFileSize(file.size)}\n`
    content += '─'.repeat(80) + '\n'

    try {
      if (file.size > config.maxFileSize) {
        content += `[ARCHIVO DEMASIADO GRANDE - Máximo: ${formatFileSize(config.maxFileSize)}]\n`
      } else {
        const fileContent = fs.readFileSync(file.path, 'utf-8')
        content += fileContent
        processedFiles++
      }
    } catch (error) {
      content += `[ERROR AL LEER ARCHIVO: ${error.message}]\n`
    }

    content += '\n\n'
  })

  // Footer
  content += '═'.repeat(80) + '\n'
  content += `  FIN DE LA DOCUMENTACIÓN\n`
  content += `  ${processedFiles} archivos procesados exitosamente\n`
  content += '═'.repeat(80) + '\n'

  return content
}

// Main function
function main() {
  console.log('🚀 Iniciando generación de documentación...\n')

  const config = loadConfig()
  const projectRoot = process.cwd()
  const fullMode = process.argv.includes('--full')

  if (fullMode) {
    console.log('📌 Modo completo activado (sin exclusiones)\n')
    config.exclude = []
  }

  // Create output directory
  const outputDir = path.join(projectRoot, config.outputDir)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Collect files
  console.log('📂 Escaneando archivos...')
  const files = traverseDirectory(projectRoot, config, projectRoot)
  console.log(`✅ ${files.length} archivos encontrados\n`)

  // Generate documentation
  console.log('📝 Generando documentación...')
  const documentation = generateDocumentation(files, config, projectRoot)

  // Write to file
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]
  const outputFileName = `${config.outputFileName}-${timestamp}.txt`
  const outputPath = path.join(outputDir, outputFileName)

  fs.writeFileSync(outputPath, documentation, 'utf-8')

  console.log('✅ Documentación generada exitosamente!\n')
  console.log(`📄 Archivo: ${outputPath}`)
  console.log(`📦 Tamaño: ${formatFileSize(Buffer.byteLength(documentation, 'utf-8'))}`)
  console.log(
    `📊 Archivos documentados: ${files.filter((f) => !f.isBinary).length}/${files.length}\n`,
  )
}

// Run
main()
