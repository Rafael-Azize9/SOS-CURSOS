# S.O.S Cursos — Site de cursos online

Este é o projeto do site da **S.O.S Cursos**: um catálogo online com mais de 100 cursos (informática, idiomas, administração e preparatórios) com certificado válido em todo o Brasil. O site é single-page (React + Vite), com matrícula direta pelo WhatsApp e painel administrativo próprio para controlar preços e promoções.

Feito do meu jeito, com a cara da S.O.S: identidade vermelha, tipografia Bricolage Grotesque e foco em conversão.

## O que o site tem

- **Home completa**: hero com imagem da marca, marquee de cursos, benefícios, como funciona, depoimentos, FAQ, números da escola e rodapé com WhatsApp.
- **Catálogo com busca**: filtro por busca, ordenação por preço/carga horária e seção de **promoções da semana** com selo "Promo".
- **Seção Kids**: vitrine da linha infantil da S.O.S.
- **Roleta Premiada** (`/#roleta`): o visitante gira uma vez por sessão e ganha de 5% a 35% de desconto em qualquer curso, com prêmio enviado pelo WhatsApp.
- **Certificado interativo**: preview de certificado com nome do aluno.
- **Painel admin** (`/#admin`): login restrito, edição de preços, gestão de promoções e backup/restauração do catálogo.
- **Supabase**: catálogo, preços e promoções vivem no banco; sem banco configurado, o site funciona com dados locais.

## Tecnologias

| Camada | Escolha |
| --- | --- |
| Framework | React 19 + TypeScript (Vite) |
| Animações | GSAP |
| Ícones | Lucide |
| Banco | Supabase (PostgreSQL) |
| Lint | Oxlint |
| Deploy | Vercel (automação a partir do GitHub) |

## Rodando localmente

```bash
npm install
npm run dev
```

Abra o endereço que o Vite mostrar (normalmente `http://localhost:5173`). O painel fica em `http://localhost:5173/#admin`.

Verificação antes de publicar:

```bash
npm run lint
npm run build
```

## Banco de dados

O catálogo é controlado pelo Supabase. Para configurar do zero:

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. No **SQL Editor**, rode o conteúdo de `supabase-setup.sql` (cria as tabelas `courses` e `promos` com as regras de segurança).
3. Copie a **Project URL** e a **anon public key** em Project Settings > API.
4. Crie um arquivo `.env` a partir do `.env.example`:
   ```
   VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   VITE_SUPABASE_ANON_KEY=SUA-CHAVE-ANON
   ```
5. No painel (`/#admin`), use **Importar catálogo padrão** para carregar os cursos e promoções no banco.

No dia a dia, o painel é o que manda: edite preços, crie promoções, exporte backup JSON e restaure quando precisar. Se o banco aparecer incompleto, o aviso **Catálogo incompleto no banco de dados** aparece no painel e o botão **Restaurar catálogo padrão** resolve em um clique.

### Recuperação de emergência

Se o banco perder os dados, há três caminhos, do mais rápido ao mais garantido:

1. **No painel**: `/#admin` > **Restaurar catálogo padrão**.
2. **Direto no SQL**: rode `restore-catalog.sql` no SQL Editor do Supabase — reinsere os 121 cursos e as 5 promoções sem sobrescrever nada (`ON CONFLICT (name) DO NOTHING`).
3. **Backup JSON**: use **Restaurar backup** no painel com o arquivo exportado anteriormente.

O site sempre tenta carregar do banco e cai nos dados locais se o banco estiver indisponível.

## Segurança

- **Painel fechado**: só o e-mail `admin.azize@soscursos.com` entra; a senha vive no Supabase, nunca no código. Após 5 tentativas erradas, o login trava por 60 segundos.
- **Escrita restrita por e-mail**: as políticas de escrita do `supabase-setup.sql` exigem que o usuário logado seja exatamente o admin — nenhuma outra conta, mesmo logada, altera ou apaga o catálogo.
- **Chave pública por design**: o site usa a anon key (pública de propósito). A `service_role` é de acesso total e nunca deve entrar no código ou no repositório.
- **Cadastros desligados**: mantenha "Allow new users to sign up" desativado no Supabase.
- **Headers de proteção**: o site publica CSP, `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` e HSTS via `public/_headers`.
- **Segredos**: chaves e tokens nunca devem ir para conversas ou repositórios; se vazarem, revogue imediatamente.

## Publicação

O repositório é `Rafael-Azize9/SOS-CURSOS` e o deploy é automático no Vercel a partir do branch `main`. Após cada push, o Vercel publica sozinho — basta conferir os hashes dos assets novos no site.

---

Feito por Rafael Azize para a S.O.S Cursos.
