# Plano do projeto

Este widget mostra um plano de projeto como uma **linha do tempo** — como o roteiro
um lançamento de veículos com feiras comerciais, séries de arranques (SOPs) e
marcos do projeto ao longo de vários anos. Ele substitui o slide do PowerPoint, 
que até agora foi mantido para tais planos e integrado como uma imagem: O Plano
está diretamente na página, pode ser alterada a qualquer momento, e os leitores
pode explorar sozinho, filtrar e baixar como uma planilha do Excel. 

O plano completo é mantido no **Editor de Plano**, que é exibido quando o
Configurações isoladas. 

## Do que consiste um plano

- **Cabeçalho** — opcional; fica acima do plano e fornece o arquivo Excel
  o nome deles. 
- **Níveis** — caminhos horizontais entre si, por exemplo "Medição", 
  "Lançamentos / SOPs" e "Marcos do Projeto". À esquerda está o título deles. 
- **Categorias** — dão cor às entradas e aparecem como uma lenda
  acima do plano, por exemplo "MY26 TG Assist" em roxo. 
- **Entradas** em três tipos: 
  - **Marco** — uma única data, mostrada como símbolo (losango, 
    triângulo, quadrado ou círculo) com o título abaixo. 
  - **Ponto** — um compasso do início ao fim, com um
    Ponta de flecha no final para "continue correndo". 
  - **Deadline** — uma data que se aplica a todos os níveis, como um novo
    regulamentar. Aparece como uma linha vertical tracejada através de todo o conjunto
    Plano, com o título abaixo. 
- **Série** — Marcos e períodos do mesmo nível com o mesmo
  Os nomes das séries estão em uma linha comum. Se incluir um período de tempo, 
  os marcos ficam em sua viga; fora isso, um estreito
  Faça a primeira com a última. 
- **Dependências** — linhas tracejadas com seta do predecessor do
  sucessor, por exemplo, de "C4S" para o SOP associado. 
- **Preliminar** — uma entrada cuja data ainda não foi determinada. Ele
  aparece apenas como um contorno ou preenchido com uma borda tracejada. 

## O que os leitores veem

De cima a baixo: 

1. **Cabeçalho** (se definido) e **"Status: ..."** — a data do último
   Altere o plano, no formato de data do idioma da página. 
2. **Barra de Ferramentas** — Buscar, **Filtrar**, Zoom (**−**, **+**, **Todos
   mostrar**), a opção de alternar **Linha do tempo | Lista** e **Exportar**. 
3. **Lenda** — categorias com suas cores. Um clique exibe um
   Categoria desligada ou ligada. 
4. **O plano** — à esquerda os títulos das camadas, à direita a linha do tempo com a
   entradas, abaixo do último nível os títulos das datas-chave. 
5. **Visão geral** — uma faixa estreita ao longo de todo o período. Uma moldura
   mostra qual seção está sendo vista no momento. 

Além disso: 

- **Zoom** é infinitamente variável: por meio dos botões **−** e **+**, com o
  tecla Ctrl (Mac: ⌘) e a roda do mouse ou com dois dedos no trackpad e
  tela sensível ao toque. O eixo muda de anos para quartos e meses para
  para semanas do calendário e dias individuais. 
- **Mover** é feito arrastando com o mouse, com Shift e a roda do mouse, 
  limpando horizontalmente ou arrastando o quadro na visão geral. 
- Um **clique em uma entrada** abre seus detalhes: tipo e data, 
  Categoria, fase, série, descrição, assim como predecessores e sucessores. 
- **Filtros** e **Busca** se aplicam apenas à sua própria visita; salvo ou
  nada é passado para os outros. 
- **Lista** mostra as mesmas entradas de uma tabela, ordenadas por data — o
  Forma mais conveniente para leitores de tela, telas estreitas e para impressão. 
- **Export** baixa as entradas como um arquivo Excel, desde que o
  Exportar está ativado nas Configurações. 
- Uma linha escura **"Today"** marca o hoje, se
  está ativado e a tag fica na seção visível. 
- A operação também funciona sem mouse: Tab pula para o plano, o
  As setas alternam entre as entradas, Enter abre os detalhes, 
  **+** e **−** Zoom, **0** mostra tudo. 
- Em telas estreitas (menos de 768 pixels de largura), filtros e
  Detalhes em uma folha do final, e **List** e **Export** estão disponíveis
  no cardápio **Mais**. 
- **Sem entradas, o widget não mostra nada** — nenhum quadro vazio e
  Sem mensagem de erro. 

## O que você vê no editor CMS

O editor de planos inclui uma **prévia** no topo: a mesma linha do tempo de em
da página, com zoom, mas sem filtros, liste e exporte. Clique em um
A entrada na prévia seleciona para edição. Como os leitores usam o plano
Com todos os filtros e a exportação, verifique na pré-visualização da página.