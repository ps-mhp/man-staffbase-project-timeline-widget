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

O editor de planos consiste no campo **Cabeçalho**, no **Prévia** e
Três abas. No canto superior direito está quantas entradas o mapa carrega, para o
Exemplo "42 / 300 entradas". 

### Rumo

| Campo | Descrição |
| --- | --- |
| Cabeçalho | No topo do editor de plantas. Fica acima do plano e dá o nome ao arquivo Excel. Opcional: Deixe em branco se a página já tiver um título adequado; o arquivo será então chamado de 'Projektplan_JJJJ-MM-TT.xlsx'. |

### Visão rápida

| Elemento de controle | Descrição |
| --- | --- |
| Pré-visualização | A mesma linha do tempo da página, com zoom, sem filtros e exportação. Clicando em uma entrada, ela é selecionada na aba "Entradas". Pode ser dobrada. |
| Esta seção como visualização inicial | Salva a seção visível da prévia, até o mês, como visualização quando a página carrega. |
| Remover a Visualização Inicial | Exclui a visualização inicial; o widget mostra o plano completo novamente ao carregar. |
| Comece com Plano de Exemplo | Somente quando o plano estiver vazio: preenche o editor com um título, três níveis, sete categorias e entradas de exemplo. |

### Aba "Inscrições" 

À esquerda está a lista de todas as entradas, ordenadas por data e via **Entradas
navegar** pesquisável; acima disso, em **Adicionar**, um botão para
**Marco**, **Ponto** e **Prazo**. À direita, a forma do
Entrada selecionada: 

| Campo | Aplica-se a | Descrição |
| --- | --- | --- |
| Tipo | Todos | Marco, período ou prazo. Se você mudar para o prazo, o nível é omitido. |
| Título | Todos | Obrigatório. Escrito na entrada e nos detalhes. |
| Descrição | Todos | Opcional, multilinha. Aparece apenas nos detalhes e na exportação do Excel. |
| Nível | Marco, Período | O nível em que a entrada está localizada. |
| Categoria | Todos | Determina a cor. "Sem categoria" aparece cinza. |
| Data | Marco, prazo | A data. |
| Início, fim | Ponto | Primeiro e último dia; ambos pertencem ao período. |
| Símbolo | Marco | Losango (padrão), triângulo, quadrado ou círculo. |
| Flecha no final | Ponto final | A barra termina em uma ponta de flecha — "segue em frente". |
| Série | Marco, Período | Entradas do mesmo nível com o mesmo nome de série estão em uma linha. O campo sugere a série desse nível. |
| Provisório | todos | A data ainda não foi definida; a entrada aparece como um contorno ou com uma borda tracejada. |
| Depende de | Marco, Ponto | Os predecessores da entrada; na página como uma linha tracejada com uma seta. |
| Duplicar | Todos | Crie uma cópia da entrada. |
| Excluir | Todos | Remove a entrada e quaisquer dependências que apontem para ela. |

### Aba de camadas 

| Elemento de controle | Descrição |
| --- | --- |
| Nova camada | Crie uma nova camada. |
| Nome | O nome da camada, à esquerda de sua órbita. Ao lado dela está quantas entradas ela contém. |
| Setas para cima / para baixo | Ordenar na página e na exportação do Excel. |
| Excluir | Remove a camada. Se ela contiver entradas, o editor pergunta se elas devem ser movidas para outra camada (selecione **Camada de Alvo**) ou se também devem ser excluídas. |

### Aba "Categorias" 

| Elemento de controle | Descrição |
| --- | --- |
| Nova Categoria | Crie uma nova categoria. |
| Nome | O nome na lenda e nos detalhes. |
| Cor | Um dos doze campos de cor. |
| Valor hexadecimal | Uma cor personalizada no formato '#RRGGBB', por exemplo '#E40045'. |
| Flechas para Cima / Para Baixo | Ordem da lenda. |
| Delete | Remove a categoria; suas entradas passam a ser "sem categoria". A consulta fornece seu número. |

## Fronteiras

- Um plano tem no máximo **300 entradas**, **20 níveis** e
  **24 categorias**. Além disso, o editor não aceita mais nada. 
- Consultas são **dias inteiros** sem tempo. A visualização inicial é
  **Mensal**. 
- O texto nunca está na cor da categoria — cores vivas como amarelo permanecem
  caso contrário, ilegível no branco. A cor é carregada apenas pelo símbolo, barra e
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