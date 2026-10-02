# Configurações

A caixa de diálogo de configuração do widget possui três campos. "Plano" é exibido no
editor de planos, que aparece ao abrir as configurações; 
O campo de texto atrás dele é a versão técnica bruta e não deve ser feito manualmente.
podem ser editados. Os dois campos restantes estão diretamente no diálogo. O
O cabeçalho do plano não é um campo do diálogo, mas é exibido no editor de planos
(veja abaixo). 

| Atributo | Rótulo no Diálogo | Descrição |
| --- | --- | --- |
| 'plano' | Plano | Cabeçalho, níveis, categorias, entradas e a visualização inicial. Mantido no editor de planos. Padrão: vazio. |
| 'mostrar-hoje' | Linha Mostrar Hoje | Uma linha vertical escura com "Hoje" no eixo marca hoje, se estiver na seção visível. Padrão: ativado. |
| 'permitir-exportar' | Oferecer exportação em Excel | Mostra aos leitores o botão **Export**, que eles usam para baixar as entradas como uma planilha Excel. Padrão: ativado. |

## O Editor de Planos

O editor de plantas preenche toda a tela. No topo está a barra de cabeçalho, abaixo dela
a **Prévia** e três abas. Entre a Prévia e as abas, e entre
Lista de inscrições e formulário possuem cada um uma alça de puxar com a altura do
e alterar a largura da lista (mouse ou setas tecladas, 
O duplo clique restaura o padrão; o navegador lembra os tamanhos). 

### Cabeçalho

| Elemento de controle | Descrição |
| --- | --- |
| Cabeçalho | Fica acima do plano e dá nome ao arquivo Excel. Opcional: Deixe em branco se a página já tiver um título adequado; o arquivo então é chamado de 'Projektplan_JJJJ-MM-TT.xlsx'. |
| "42 / 300 inscrições" | Quantas entradas o plano contém, medidas em relação ao limite máximo. |
| "Alterações Não Salvas" | Aparece assim que o plano no editor difere do que foi salvo. |
| Cancelar | Fecha o editor; no caso de alterações não salvas, ele pergunta antecipadamente se elas devem ser descartadas. |
| Aplicar | Escreva o plano nas configurações e feche o editor. Ele é salvo junto com a página. |

### Visão rápida

| Elemento de controle | Descrição |
| --- | --- |
| Prévia | A mesma linha do tempo da página, com zoom, sem filtro e exportação. Clicar em uma entrada seleciona-a na aba "Entradas" e a traz para a vista na lista. Clicar em **Prévia** colapsa; desdobrada, tem a última altura desenhada. |
| Esta seção como visualização inicial | Salva a seção visível da prévia, até o mês, como visualização quando a página carrega. |
| Remover a Visualização Inicial | Exclui a visualização inicial; o widget mostra o plano completo novamente ao carregar. |
| Comece com o Template | Somente se o plano estiver vazio: mostra os templates para escolher ("Product Roadmap", "Reagendamento"). Clicar em um cartão preenche o editor com ele; **Return** retorna sem alteração. |
| Comece vazio | Somente se o plano estiver vazio: crie uma camada "Nível 1". |

### Aba "Inscrições" 

À esquerda está a lista de entradas, ordenadas por data. Acima estão
**Navegue por entradas** e abaixo uma opção para o tipo — 
**Marcos**, **Pontos**, **Prazos**, cada um com número (se ativo
search: hits); o botão **+** ao lado cria uma entrada desse tipo, 
e a busca funciona dentro da espécie. 
Ao passar o mouse sobre uma linha, uma lixeira de reciclagem aparece à direita para exclusão (com
Consulta). 

À direita, a forma da entrada selecionada; acima dela está seu título e
os botões **Duplicar** e **Excluir**, abaixo dos quais estão as abas **Geral** 
(Tipo, Título, Descrição), **Classificação** (Nível, Categoria, Série), 
**Data** (data ou início e fim, para a seta do ponto final, provisória)
**Dependências** e **Conteúdo** (página linkada ou post de notícia). A
o ponto vermelho na aba mostra uma entrada inválida; para datas-chave
**Dependências** eliminadas: 

| Campo | Aplica-se a | Descrição |
| --- | --- | --- |
| Tipo | Todos | Marco, período ou prazo. Se você mudar para o prazo, o nível é omitido. |
| Título | Todos | Obrigatório. Escrito na entrada e nos detalhes. |
| Descrição | Todos | Opcional, multilinha. Aparece apenas nos detalhes e na exportação do Excel. |
| Nível | Marco, Ponto | O nível em que a entrada está localizada. **Nova camada ...** cria um (nome) e o atribui imediatamente. |
| Categoria | todos | Determina a cor e, para marcos, a forma. "Sem categoria" aparece cinza, marcos como losango. **Nova categoria ...** cria um (nome, cor e forma) e o atribui imediatamente. |
| Data | Marco, prazo | A data. |
| Início, fim | Ponto | Primeiro e último dia; ambos pertencem ao período. |
| Flecha no final | Ponto final | A barra termina em uma ponta de flecha — "segue em frente". |
| Série | Marco, Ponto | Entradas do mesmo nível com o mesmo nome de série estão em uma linha. O campo expande a série deste nível com o número de suas entradas; um novo nome digitado é assumido via ""..." criar como uma nova série", **Nenhuma série** remove a entrada. |
| Provisório | todos | A data ainda não foi definida; a entrada aparece como um contorno ou com uma borda tracejada. |
| Depende de | Marco, Ponto | Os predecessores da entrada; na página como uma linha tracejada com uma seta. |
| Link | todos | **Nenhum**, **Página** ou **Artigo de notícias**. Uma mudança quebra um link existente. Na página, a inscrição da entrada é então sublinhada, e um clique abre o conteúdo em uma janela acima do plano. |
| Página | Todos | A página Staffbase da lista de páginas (as 100 mais recentemente editadas). **Nova página ...** cria no editor Staffbase, que sobrepõe o editor de planos; após criá-la, ela é vinculada. |
| Canal, Post | todos | Primeiro o canal de notícias (com seu tipo: artigo, mensagem curta, post com imagem), depois o post. Os rascunhos são selecionáveis e marcados com "(rascunho)" — os leitores só os veem após a publicação. **Nova postagem ...** cria uma no canal selecionado; após salvar, ela é vinculada. **Abrir em nova aba** mostra o conteúdo vinculado. |
| Anexos | Todos | Até dez arquivos ou imagens da biblioteca de mídia, cada um com legenda opcional (caso contrário, o nome do arquivo). **Adicionar arquivo ou imagem ...** abre a biblioteca; **↑**/**↓** organizar, **×** removido. Anexos permanecem atrás do login. Na página, eles ficam ao lado do conteúdo vinculado ou nos detalhes, na exportação do Excel na coluna "Anexos". |
| Duplicar | Todos | Crie uma cópia da entrada. |
| Delete | todos | Pede e então remove a entrada e todas as dependências que apontam para ela; a consulta nomeia as entradas dependentes. |

### Aba de camadas 

| Elemento de controle | Descrição |
| --- | --- |
| Nova camada | No canto superior direito da aba. Crie uma nova camada. |
| Nome | O nome da camada, à esquerda de sua órbita. Deve ser única. Ao lado dela está quantas entradas ela contém. |
| Setas para cima / para baixo | Ordenar na página e na exportação do Excel. |
| Excluir | Remove a camada. Se ela contiver entradas, o editor pergunta se elas devem ser movidas para outra camada (selecione **Camada de Alvo**) ou se também devem ser excluídas. |

### Aba "Categorias" 

| Elemento de controle | Descrição |
| --- | --- |
| Nova Categoria | Canto superior direito da aba. Crie uma nova categoria. |
| Campo de Cor | Na frente do nome; mostra a cor. Um clique expande as doze cores e o campo **Valor Hex**; Esc ou um clique ao lado fecha. |
| Valor hexadecimal | Uma cor personalizada no formato '#RRGGBB', por exemplo '#E40045'. |
| Botão de Forma | Ao lado do campo de cor; mostra a forma com a qual aparecem os marcos da categoria. Um clique abre as oito formas: losango, triângulo, triângulo com a ponta para baixo, quadrado, círculo, hexágono, estrela ou cruz. Teclas de seta mudam a forma. |
| Nome | O nome na legenda e nos detalhes. Deve ser único. Ao lado está quantas entradas a categoria está atribuída. |
| Flechas para Cima / Para Baixo | Ordem da lenda. |
| Delete | Remove a categoria; suas entradas passam a ser "sem categoria". A consulta fornece seu número. |

## Fronteiras

- Um plano tem no máximo **300 entradas**, **20 níveis** e
  **24 categorias**. Além disso, o editor não aceita mais nada. 
- Consultas são **dias inteiros** sem tempo. A visualização inicial é
  **Mensal**. 
- O texto nunca está na cor da categoria — cores vivas como amarelo permanecem
  de outra forma, ilegível no branco. A cor é transmitida apenas pela forma, barras e
  ponto de lenda; a escrita no bar é preta ou branca, dependendo do que
  é mais fácil de ler. 
- **Sem entradas, o widget não mostra nada** — nem um quadro vazio nem
  Uma mensagem. 

## Dependências entre configurações

- **Linha Mostrar hoje** só funciona se hoje estiver visível
  trecho. No caso de um plano que seja totalmente passado ou
  Futuro, a linha só pode ser vista depois de ser movida. 
- O **cabeçalho** também determina o nome do arquivo Excel; sem
  Funciona apenas como manchete. 
- **Cabeçalho** e **Visualização inicial** estão definidos no editor de planos, não no
  diálogo; ambos fazem parte do plano.