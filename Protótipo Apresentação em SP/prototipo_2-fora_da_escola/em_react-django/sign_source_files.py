#!/usr/bin/env python3
"""
Script de Assinatura Automatizada de Código-Fonte do NHN_APP
-------------------------------------------------------------
Insere o cabeçalho de licença GNU AGPLv3 nos arquivos de código-fonte
pertinentes do projeto, ignorando bibliotecas de terceiros (node_modules,
pycache, venv, dist, etc.) e respeitando a sintaxe de comentários de cada linguagem.

Autor: Enio Alves Borges & Colaboradores do Projeto NHN_APP
Licença: GNU AGPLv3
"""

import os
import sys
import argparse

HEADER_TEXT = """NHN_APP — Conectando Produtores e Consumidores de Orgânicos In-Natura
Copyright (C) 2023–2026 Enio Alves Borges & Colaboradores do Projeto NHN_APP

Este programa é um software livre; você pode redistribuí-lo e/ou modificá-lo
sob os termos da Licença Pública Geral GNU Affero (GNU AGPLv3) conforme publicada
pela Free Software Foundation, versão 3 da Licença.

Este programa é distribuído na expectativa de ser útil, mas SEM QUALQUER
GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO ou ADEQUAÇÃO A UM
PROPÓSITO EM PARTICULAR. Veja a Licença Pública Geral GNU Affero para mais detalhes.

Você deve ter recebido uma cópia da Licença Pública Geral GNU Affero junto com
este programa. Se não, veja <https://www.gnu.org/licenses/>."""

# Diretórios que DEVEM ser ignorados (código de terceiros, compilações, dados)
IGNORE_DIRS = {
    'node_modules',
    'dist',
    'build',
    '__pycache__',
    '.git',
    '.github',
    'venv',
    '.venv',
    'env',
    'site-packages',
    'media_root',
    'static',
    'migrations',
    '.idea',
    '.vscode',
    'coverage',
    '.pytest_cache',
}

# Tipos de comentários por extensão de arquivo
HASH_EXTENSIONS = {'.py', '.sh', '.bash', '.yaml', '.yml'}
SLASH_EXTENSIONS = {'.js', '.jsx', '.ts', '.tsx', '.c', '.cpp', '.cc', '.h', '.hpp', '.java', '.go', '.rs'}
CSS_EXTENSIONS = {'.css', '.scss', '.sass', '.less'}
HTML_EXTENSIONS = {'.html', '.xml', '.vue'}

ALL_EXTENSIONS = HASH_EXTENSIONS | SLASH_EXTENSIONS | CSS_EXTENSIONS | HTML_EXTENSIONS

def format_header(ext: str) -> str:
    """Formata o texto da licença conforme a sintaxe da linguagem."""
    lines = HEADER_TEXT.split('\n')
    
    if ext in HASH_EXTENSIONS:
        commented = [f"# {line}".rstrip() for line in lines]
        return "\n".join(commented) + "\n\n"
    elif ext in SLASH_EXTENSIONS:
        commented = [f"// {line}".rstrip() for line in lines]
        return "\n".join(commented) + "\n\n"
    elif ext in CSS_EXTENSIONS:
        block = ["/*"] + [f" * {line}".rstrip() for line in lines] + [" */"]
        return "\n".join(block) + "\n\n"
    elif ext in HTML_EXTENSIONS:
        block = ["<!--"] + [f"  {line}".rstrip() for line in lines] + ["-->"]
        return "\n".join(block) + "\n\n"
    
    return ""

def is_already_signed(content: str) -> bool:
    """Verifica se o arquivo já possui a assinatura no início."""
    sample = content[:1500]
    markers = [
        "Copyright (C) 2023–2026 Enio Alves Borges",
        "Licença Pública Geral GNU Affero",
        "NHN_APP — Conectando Produtores"
    ]
    return any(marker in sample for marker in markers)

def sign_file(file_path: str, ext: str, dry_run: bool = False) -> str:
    """Assina um arquivo individual inserindo o cabeçalho no local correto."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return f"ERRO_LEITURA: {e}"

    if is_already_signed(content):
        return "JA_ASSINADO"

    header = format_header(ext)
    if not header:
        return "EXTENSAO_NAO_SUPORTADA"

    # Lógica para preservar Shebang (#!/...) ou declaração de encoding no topo do arquivo
    lines = content.splitlines(keepends=True)
    insert_idx = 0
    
    # Se começar com shebang ou encoding, insere logo abaixo
    while insert_idx < len(lines):
        line = lines[insert_idx].strip()
        if line.startswith("#!") or "coding:" in line or "coding=" in line:
            insert_idx += 1
        else:
            break

    new_content = "".join(lines[:insert_idx])
    if insert_idx > 0 and not new_content.endswith("\n"):
        new_content += "\n"
    new_content += header + "".join(lines[insert_idx:])

    if not dry_run:
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
        except Exception as e:
            return f"ERRO_ESCRITA: {e}"

    return "ASSINADO"

def main():
    parser = argparse.ArgumentParser(description="Assina arquivos de código-fonte do NHN_APP com a licença GNU AGPLv3.")
    parser.add_argument("--dir", default=".", help="Diretório raiz do projeto (padrão: diretório atual)")
    parser.add_argument("--dry-run", action="store_true", help="Simula a execução sem alterar os arquivos")
    args = parser.parse_args()

    target_dir = os.path.abspath(args.dir)
    if not os.path.exists(target_dir):
        print(f"❌ Diretório não encontrado: {target_dir}")
        sys.exit(1)

    print(f"🌱 Iniciando varredura e assinatura de código-fonte no diretório: {target_dir}")
    if args.dry_run:
        print("⚠️ Modo SIMULAÇÃO (--dry-run) ativado. Nenhum arquivo será alterado.")

    signed_count = 0
    skipped_count = 0
    already_signed_count = 0
    error_count = 0

    for root, dirs, files in os.walk(target_dir):
        # Filtra diretórios a serem ignorados
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

        for file in sorted(files):
            _, ext = os.path.splitext(file)
            ext = ext.lower()

            if ext not in ALL_EXTENSIONS:
                skipped_count += 1
                continue

            file_path = os.path.join(root, file)
            rel_path = os.path.relpath(file_path, target_dir)

            result = sign_file(file_path, ext, dry_run=args.dry_run)

            if result == "ASSINADO":
                print(f"  [✓] Assinado: {rel_path}")
                signed_count += 1
            elif result == "JA_ASSINADO":
                already_signed_count += 1
            elif result.startswith("ERRO"):
                print(f"  [❌] {result}: {rel_path}")
                error_count += 1

    print("\n--------------------------------------------------")
    print("📊 RESUMO DA OPERAÇÃO:")
    print(f"  • Arquivos assinados com sucesso: {signed_count}")
    print(f"  • Arquivos já assinados anteriormente: {already_signed_count}")
    print(f"  • Arquivos e libs ignorados (outras extensões/pacotes): {skipped_count}")
    if error_count > 0:
        print(f"  • Erros encontrados: {error_count}")
    print("--------------------------------------------------\n")

if __name__ == "__main__":
    main()
