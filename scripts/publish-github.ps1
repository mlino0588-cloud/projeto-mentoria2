param([string]$Repository = 'mlino0588-cloud/projeto-mentoria')
$ErrorActionPreference = 'Stop'
$siteRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
Set-Location -LiteralPath $siteRoot
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  throw 'Instale o GitHub CLI pelo site oficial https://cli.github.com e execute este script novamente.'
}
gh auth status
if ($LASTEXITCODE -ne 0) { gh auth login; if ($LASTEXITCODE -ne 0) { throw 'Login não concluído.' } }
if (-not (Test-Path -LiteralPath (Join-Path $siteRoot '.git'))) {
  git init -b main
  if ($LASTEXITCODE -ne 0) { throw 'Não foi possível inicializar o Git nesta pasta.' }
}
$remote = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0 -and $remote) { throw "Já existe origin: $remote. Confira esse destino antes de enviar arquivos." }
git add -- index.html obrigado.html styles.css app.js config.js package.json vercel.json .gitignore README.md assets lib scripts tests docs
if ($LASTEXITCODE -ne 0) { throw 'Não foi possível preparar os arquivos.' }
git diff --cached --quiet
if ($LASTEXITCODE -eq 1) {
  git -c user.name='Mateus Lino' -c user.email='327282365+mlino0588-cloud@users.noreply.github.com' commit -m 'Cria página de vendas da mentoria com checkout Kiwify'
  if ($LASTEXITCODE -ne 0) { throw 'Não foi possível criar o commit.' }
}
gh repo create $Repository --private --source . --remote origin --push
if ($LASTEXITCODE -ne 0) { throw 'Não foi possível criar ou enviar o repositório. Confira a mensagem do GitHub CLI.' }
gh repo view $Repository --json url --jq .url
