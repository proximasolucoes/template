export default {
  // Para arquivos JS/JSX, roda o linter consertando o possível, depois formata
  '*.{js,jsx}': [
    'eslint --fix',
    'prettier --write'
  ],
  // Para arquivos de configuração e markdown, apenas formata
  '*.{json,md}': [
    'prettier --write'
  ]
}