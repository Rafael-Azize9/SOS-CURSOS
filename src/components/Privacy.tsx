import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react';
import { CONTACT } from '../data';

const SECTIONS = [
  {
    title: '1. Controladora dos dados e abrangência',
    body: [
      'A S.O.S Cursos, doravante denominada simplesmente "S.O.S Cursos" ou "nós", atua como controladora dos dados pessoais tratados por meio deste site, nos termos do art. 5º, VI, e art. 37 da Lei nº 13.709/2018 (LGPD).',
      'Esta Política de Privacidade se aplica a todos os visitantes, alunos, responsáveis legais de alunos menores e demais titulares de dados que interajam com o nosso site ou com os nossos canais de atendimento (WhatsApp e e-mail).',
    ],
  },
  {
    title: '2. Princípios do tratamento (art. 6º da LGPD)',
    body: [
      'Todo tratamento de dados pessoais realizado por nós observa os princípios da finalidade, adequação, necessidade, livre acesso, qualidade dos dados, transparência, segurança, prevenção, não discriminação e responsabilização, conforme o art. 6º da LGPD.',
      'Isso significa que: coletamos apenas o mínimo necessário; usamos seus dados somente para as finalidades informadas nesta política; e adotamos medidas para garantir segurança, correção e transparência em todas as etapas do tratamento.',
    ],
  },
  {
    title: '3. Quais dados coletamos e como',
    body: [
      'Coletamos apenas os dados estritamente necessários ao funcionamento dos nossos serviços:',
      '– Informações fornecidas por você: nome, telefone (WhatsApp), e-mail e o conteúdo das mensagens enviadas espontaneamente pelos nossos canais de atendimento;',
      '– Dados de navegação: endereço IP, data e hora de acesso, páginas visitadas, tipo de dispositivo e navegador, coletados de forma automatizada para fins estatísticos, de segurança e de prevenção a fraudes;',
      '– Dados de pagamento: o processamento financeiro (PIX, cartões e boletos) é realizado exclusivamente por instituições de pagamento que atuam como operadoras independentes, com políticas próprias. Não coletamos nem armazenamos dados de cartão de crédito em nossos servidores.',
      'Não coletamos dados sensíveis (art. 5º, II, da LGPD), como origem racial, convicção religiosa, opinião política ou dados de saúde, salvo se você os fornecer voluntariamente em mensagens de atendimento.',
    ],
  },
  {
    title: '4. Finalidades e bases legais (art. 7º da LGPD)',
    body: [
      'Tratamos seus dados pessoais para as seguintes finalidades, com as respectivas bases legais:',
      '– Atendimento, matrícula, emissão de certificado e suporte ao aluno: execução de contrato e de procedimentos preliminares (art. 7º, V);',
      '– Comunicação sobre cursos em que você demonstrou interesse: legítimo interesse (art. 7º, IX) ou consentimento (art. 7º, I);',
      '– Segurança, prevenção a fraudes e proteção do nosso conteúdo: legítimo interesse (art. 7º, IX);',
      '– Cumprimento de obrigações legais, fiscais e regulatórias: cumprimento de obrigação legal (art. 7º, II);',
      '– Armazenamento de preferências de navegação em cookies: consentimento (art. 7º, I), conforme a seção 7 desta política.',
      'O consentimento, quando exigido, é livre, informado e inequívoco, e pode ser revogado a qualquer momento, sem prejuízo da legalidade do tratamento realizado antes da revogação.',
    ],
  },
  {
    title: '5. Compartilhamento e proteção dos nossos cursos',
    body: [
      'Não vendemos, alugamos, cedemos ou compartilhamos seus dados pessoais com terceiros para fins comerciais. O acesso às aulas, aos materiais e aos certificados é pessoal e intransferível, sendo vedado ao aluno compartilhar suas credenciais de acesso.',
      'Todo o conteúdo dos cursos, materiais de apoio, marcas, logotipos e identidade visual são de propriedade da S.O.S Cursos e de seus parceiros, protegidos pela Lei nº 9.610/98 (Direitos Autorais) e pela Lei nº 9.279/96 (Propriedade Industrial). É vedada a cópia, reprodução, distribuição, compartilhamento ou revenda, total ou parcial, sem autorização expressa e por escrito.',
      'Para a defesa dos direitos da S.O.S Cursos e de seus parceiros, poderemos registrar informações de acesso (IP, data, hora e dispositivo) e utilizá-las em procedimentos administrativos ou judiciais quando houver indício de fraude, violação de direitos autorais, uso indevido dos nossos produtos ou descumprimento das condições de uso.',
    ],
  },
  {
    title: '6. Transferência internacional de dados (art. 33 da LGPD)',
    body: [
      'Eventualmente, podemos utilizar serviços de terceiros (como plataformas de hospedagem, envio de e-mails e ferramentas de estatística) que armazenam dados em servidores localizados fora do Brasil. Nesses casos, garantimos que a transferência ocorre em conformidade com o art. 33 da LGPD, adotando cláusulas contratuais adequadas e níveis de proteção compatíveis com a legislação brasileira.',
    ],
  },
  {
    title: '7. Cookies e preferências do usuário (art. 7º, I, da LGPD)',
    body: [
      'Utilizamos cookies — pequenos arquivos de texto armazenados no seu navegador — para lembrar suas preferências e melhorar sua experiência de navegação. O uso de cookies de preferências depende do seu consentimento, que é solicitado na primeira visita por meio do nosso aviso de cookies. Você pode aceitar todos, aceitar somente os essenciais ou alterar sua escolha a qualquer momento, bastando limpar os cookies do navegador.',
      'Cookies utilizados por este site:',
    ],
    table: [
      ['Cookie', 'Finalidade', 'Prazo'],
      ['sos_consent', 'Registra a sua escolha sobre o uso de cookies (consentimento)', '365 dias'],
      ['sos_cat', 'Lembra a categoria de curso selecionada no catálogo', '365 dias'],
      ['sos_sort', 'Lembra a ordem de exibição preferida no catálogo', '365 dias'],
    ],
    afterTable: [
      'Você pode bloquear ou excluir cookies nas configurações do seu navegador a qualquer momento. Nesse caso, algumas preferências poderão ser perdidas, mas o site continuará funcionando normalmente.',
    ],
  },
  {
    title: '8. Direitos do titular (art. 18 da LGPD)',
    body: [
      'Nos termos do art. 18 da LGPD, você pode solicitar, a qualquer momento e gratuitamente:',
      '– confirmação da existência de tratamento de seus dados pessoais;',
      '– acesso aos dados tratados;',
      '– correção de dados incompletos, inexatos ou desatualizados;',
      '– anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a lei;',
      '– portabilidade dos dados a outro fornecedor de serviço ou produto;',
      '– eliminação dos dados tratados com base no consentimento;',
      '– informação sobre as entidades públicas e privadas com as quais compartilhamos seus dados;',
      '– informação sobre a possibilidade de não fornecer consentimento e sobre as consequências da negativa;',
      '– revogação do consentimento (art. 8º, § 5º).',
      'As solicitações devem ser encaminhadas pelo e-mail indicado na seção 12 e serão respondidas no prazo de até 15 (quinze) dias, conforme o art. 18, § 2º, da LGPD. Caso não seja possível atender à solicitação, informaremos os motivos. Você também pode apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD).',
    ],
  },
  {
    title: '9. Crianças e adolescentes (art. 14 da LGPD)',
    body: [
      'Os cursos da linha Kids são voltados ao público infantil. A matrícula e o atendimento são realizados exclusivamente com a supervisão e o consentimento específico e destacado dos pais ou responsáveis legais, conforme o art. 14 da LGPD. Os dados de crianças e adolescentes são tratados com redobrado cuidado e utilizados somente para a prestação do serviço contratado.',
    ],
  },
  {
    title: '10. Segurança, retenção e incidentes',
    body: [
      'Adotamos medidas técnicas e organizacionais adequadas, incluindo criptografia em trânsito e controle de acesso, para proteger seus dados contra acessos não autorizados, perda, alteração ou destruição (art. 46 da LGPD).',
      'Mantemos seus dados somente pelo tempo necessário às finalidades desta política ou enquanto houver obrigação legal de guarda, inclusive para o exercício regular de direitos em processo judicial, administrativo ou arbitral.',
      'Em caso de incidente de segurança que possa acarretar risco ou dano relevante, comunicaremos você e a ANPD, conforme o art. 48 da LGPD.',
    ],
  },
  {
    title: '11. Alterações desta política',
    body: [
      'Esta política pode ser atualizada sempre que necessário, especialmente para refletir mudanças legais ou nos nossos serviços. A versão vigente estará sempre disponível nesta página, com a data de atualização. A continuidade no uso do site após a publicação de alterações implica ciência e concordância com os novos termos.',
    ],
  },
];

export default function Privacy() {
  return (
    <div className="privacy-page">
      <header className="privacy-header">
        <a className="brand" href="#topo" aria-label="S.O.S Cursos início">
          <span className="brand-badge">SOS</span>
          <span className="brand-text">
            S.O.S <strong>CURSOS</strong>
          </span>
        </a>
      </header>

      <main className="privacy-main">
        <div className="container">
          <a className="privacy-back" href="#topo">
            <ArrowLeft strokeWidth={2.4} /> Voltar para o site
          </a>

          <p className="eyebrow">Privacidade</p>
          <h1 className="privacy-title">
            <ShieldCheck strokeWidth={2} /> Política de Privacidade
          </h1>
          <p className="privacy-updated">Última atualização: 18 de agosto de 2026</p>
          <p className="privacy-intro">
            Esta Política de Privacidade descreve, de forma clara e transparente, como a S.O.S Cursos
            coleta, usa, armazena, compartilha e protege os dados pessoais de quem acessa nosso site ou
            contrata nossos cursos, em conformidade com a Lei nº 13.709/2018 (LGPD), o Marco Civil da
            Internet (Lei nº 12.965/2014) e demais normas aplicáveis.
          </p>

          <div className="privacy-sections">
            {SECTIONS.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                {section.body.map((paragraph) =>
                  paragraph.startsWith('–') ? (
                    <p className="privacy-item" key={paragraph}>{paragraph}</p>
                  ) : (
                    <p key={paragraph}>{paragraph}</p>
                  )
                )}
                {section.table && (
                  <div className="privacy-table-wrap">
                    <table className="privacy-table">
                      <thead>
                        <tr>
                          {section.table[0].map((cell) => (
                            <th key={cell}>{cell}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.slice(1).map((row) => (
                          <tr key={row[0]}>
                            {row.map((cell) => (
                              <td key={cell}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {section.afterTable?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </section>
            ))}
          </div>

          <section className="privacy-contact">
            <h2>12. Fale conosco e encarregado de dados</h2>
            <p>
              Em caso de dúvidas sobre esta política, para exercer seus direitos como titular ou para
              falar com o nosso Encarregado de Dados (DPO), entre em contato:
            </p>
            <p>
              <Mail strokeWidth={2} /> <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </p>
            <p className="privacy-dpo-note">
              Atendimento em até 15 (quinze) dias úteis. Você também pode registrar reclamação junto à
              Autoridade Nacional de Proteção de Dados (ANPD).
            </p>
          </section>
        </div>
      </main>

      <footer className="privacy-footer">
        <div className="container">
          <p>&copy; 2026 S.O.S Cursos. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}