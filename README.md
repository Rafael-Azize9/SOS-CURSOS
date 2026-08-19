# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Banco de dados (cursos, preços e promoções)

O catálogo, os preços e as promoções são controlados por um banco no [Supabase](https://supabase.com) (plano gratuito). O painel de edição fica em `/#admin` (com login por e-mail e senha).

### Passo a passo (uma vez só)

1. Crie uma conta grátis em https://supabase.com e um novo projeto.
2. No projeto, abra **SQL Editor > New query**, cole o conteúdo de `supabase-setup.sql` e clique em **RUN** (cria as tabelas `courses` e `promos` com as regras de segurança).
3. Em **Project Settings > API**, copie a **Project URL** e a **anon public key**.
4. Na raiz do projeto, crie um arquivo `.env` baseado no `.env.example`:
   ```
   VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   VITE_SUPABASE_ANON_KEY=SUA-CHAVE-ANON
   ```
   ⚠️ Nunca suba o `.env` para o repositório (ele já está no `.gitignore`). No Netlify/Vercel, cadastre as mesmas duas variáveis em **Site settings > Environment variables** antes de publicar.
5. Rode `npm run dev` e acesse `/#admin`. Entre com o usuário `admin.azize` e a senha da conta administradora (definida na criação do usuário no Supabase).
6. Na aba **Cursos** e **Promoções**, use **Importar catálogo padrão** para carregar os dados atuais do site no banco. A partir daí, tudo o que você salvar vale para todos os visitantes.

### Como usar no dia a dia

- **Mudar preço de um curso**: acesse `/#admin`, edite o valor na tabela de cursos e clique no botão de salvar da linha.
- **Adicionar promoção**: na aba Promoções, preencha nome, carga horária, "De" (preço antigo) e "Por" (preço promocional) e salve. A promoção aparece na seção de ofertas do catálogo e com o selo "Promo" nos cards do curso.
- **Adicionar curso novo**: na aba Cursos, clique em **Adicionar curso**, preencha os campos e salve.

O site principal carrega os dados do banco automaticamente a cada visita; sem configuração do Supabase ele continua funcionando com os dados locais.
