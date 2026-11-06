# Plano do projeto

Este widget apresenta um plano do projeto sob a forma de uma **linha do tempo** — por exemplo, o calendário
do lançamento de um veículo, incluindo feiras, arranques de produção em série (SOPs) e
marcos do projeto ao longo de vários anos. Substitui o slide do PowerPoint,
que até agora era atualizado para estes planos e incorporado como imagem: o plano
aparece diretamente na página, pode ser alterado a qualquer momento e os leitores
podem explorá-lo, filtrá-lo e descarregá-lo como uma folha de cálculo do Excel.

Todo o plano é gerido no **Editor de Planos**, que aparece automaticamente ao abrir as
configurações.

## Em que consiste um plano

- **Título** — opcional; aparece acima do plano e dá ao ficheiro Excel
  o seu nome.
- **Níveis** — faixas horizontais umas abaixo das outras, por exemplo, «Medidas»,
  «Lançamentos / SOPs» e «Marcos do projeto». À esquerda, aparece o respetivo título.
- **Categorias** — atribuem cor às entradas e aparecem como legenda
  acima do plano, por exemplo, «MY26 TG Assist» em violeta.
- **Entradas** de três tipos:
  - **Marco** — uma data única, apresentada como um símbolo (losango,
    triângulo, quadrado ou círculo) com o título por baixo.
  - **Período** — uma barra do início ao fim, opcionalmente com uma
    ponta de seta no final para indicar «em curso».
  - **Data-limite** — uma data que se aplica a todos os níveis, como, por exemplo, uma nova
    regulamentação. Aparece como uma linha vertical tracejada ao longo de todo o
    plano, com o título por baixo.
- **Séries** — os marcos e os períodos do mesmo nível com o mesmo
  nome de série aparecem numa linha comum. Se um período fizer parte da série,
  os marcos situam-se na sua barra; caso contrário, uma barra estreita
  liga o primeiro ao último.
- **Dependências** — linhas tracejadas com seta do predecessor para o
  sucessor, por exemplo, de «C4S» para o SOP correspondente.
- **Provisório** — uma entrada cuja data ainda não está definida. Aparece
  apenas como um contorno ou preenchida com uma cor clara e com uma borda tracejada.

## O que os leitores veem

De cima para baixo:

1. **Título** (se definido) e **«Data: …»** — a data da última
   alteração no plano, no formato de data do idioma da página.
2. **Barra de ferramentas** — Pesquisa, **Filtro**, Zoom (**−**, **+**, **Mostrar tudo
  **), o botão de alternância **Linha do tempo | Lista**, **Exportar**,
   **Ecrã inteiro** e **Ajuda**.
3. **Legenda** — as categorias com as respetivas cores. Um clique oculta ou
   volta a exibir uma categoria.
4. **O plano** — à esquerda, os títulos das camadas; à direita, a linha do tempo com as
   entradas; abaixo da última camada, os títulos das datas de referência. A seta junto ao
   título recolhe uma camada; **Recolher tudo**, acima dos títulos, recolhe
   todas de uma só vez e, em seguida, volta a expandi-las.
5. **Visão geral** — uma faixa estreita ao longo de todo o período. Uma moldura
   indica qual a secção que está atualmente visível.

Além disso:

- O **zoom** é contínuo: através dos botões **−** e **+**, com a tecla
  Ctrl (Mac: ⌘) premida e a roda do rato, ou com dois dedos no trackpad e
  no ecrã tátil. O eixo alterna entre anos, trimestres e meses até
  semanas do calendário e dias individuais.
- **Deslocar** é possível arrastando com o rato, com a tecla Shift e a roda do rato,
  deslizando horizontalmente ou arrastando a moldura na visão geral.
- Um **clique numa entrada** abre os seus detalhes: tipo e data,
  categoria, nível, série, descrição, bem como antecessor e sucessor.
- Os **filtros** e a **pesquisa** aplicam-se apenas à sua própria visita; nada é guardado ou
  partilhado com outras pessoas.
- **Lista** apresenta as mesmas entradas numa tabela, ordenadas por data — a
  opção mais prática para leitores de ecrã, ecrãs estreitos e para impressão.
- **Exportar** descarrega as entradas como ficheiro Excel, desde que a
  exportação esteja ativada nas definições.
- Uma linha escura **«Hoje»** destaca o dia de hoje, desde que esta
  opção esteja ativada e o dia se encontre na secção visível.
- A navegação também funciona sem rato: a tecla Tab salta para o plano, as
  teclas de seta alternam entre as entradas, a tecla Enter abre os detalhes,
  **+** e **−** ampliam ou reduzem a visualização, **0** mostra tudo.
- Em ecrãs estreitos (com menos de 768 píxeis de largura), o plano começa na
  **Lista** — sob a forma de cartões em vez de tabela, porque a linha do tempo não tem
  largura nesse modo; o botão de alternância no menu **Mais** leva à linha do tempo a qualquer momento.
  Da mesma forma, os filtros e os detalhes abrem-se como uma aba a partir da parte inferior, e
  **Lista** e **Exportar** encontram-se no menu **Mais**.
- **Ecrã inteiro** mostra o plano em todo o ecrã, com o mesmo
  funcionamento; apenas o plano é que se desloca, enquanto o eixo e a visão geral permanecem fixos.
  **Esc** ou **Sair do ecrã inteiro** regressa à página. Nos casos em que o navegador não
  permite um ecrã inteiro verdadeiro (como o Safari no iPhone), o plano ocupa
  toda a página.
- **Ajuda** explica aos leitores, diretamente na página, o que os símbolos
  significam (separador **Legenda**, com as categorias deste plano) e como utilizar o
  plano com o rato, o trackpad, o ecrã tátil e o teclado (separador **Utilização**).
  A partir do plano, a tecla **?** também abre a ajuda. No editor do plano,
  esse botão não existe.
- **Sem entradas, o widget não mostra absolutamente nada** — nem uma moldura vazia nem
  uma mensagem de erro.

## O que vê no Editor do CMS

O Editor do Plano inclui, na parte superior, uma **Pré-visualização**: a mesma linha do tempo que na
página, com zoom, mas sem filtros, lista nem exportação. Um clique numa
entrada na pré-visualização seleciona-a para edição. Para verificar como os leitores
vêem o plano com todos os filtros e a opção de exportação, consulte a pré-visualização da página.
