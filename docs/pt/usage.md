# Passo a passo

## Crie o plano

1. Coloque o widget **Plano de Projeto** na página, preferencialmente em um
   coluna larga: Uma linha do tempo precisa de espaço na largura. Em um
   coluna estreita, permanece operável, mas mostra menos de cada vez. 
2. Abra as configurações do widget. O editor de planos abre a partir de
   ele mesmo. 
3. Um novo plano começa com uma camada de "Nível 1". Você prefere
   um modelo finalizado, siga a seção "Usando o
   Plano de Exemplo". 
4. No topo do editor de planos, em **Cabeçalho**, opcionalmente adicione um título
   para o plano. Ele está acima do plano e dá ao arquivo Excel seu
   Nomes. 
5. Crie as camadas na aba **Camadas** — veja "Manter camadas". 
6. Na aba **Categorias**, crie as categorias com suas cores — 
   veja "Categorias de manutenção". 
7. Na aba **Entradas**, defina os marcos, períodos de tempo e prazos
   — veja as seções a seguir. 
8. Clique em **Candidatar**. 
9. No diálogo, marque os botões **Linha Mostrar Hoje** e
   **Oferecer exportação do Excel**; ambos são pré-ativados. 
10. Salve a página e pré-visualize o resultado. 

## Comece com o plano de amostras

1. Abra as configurações de um widget cujo plano ainda esteja vazio. 
2. No Editor de Planos, clique **Iniciar com Plano de Exemplo**. O Editor
   é preenchida com o título "Lançamento de Caminhão de Vendas", três níveis, sete
   Categorias e inscrições baseadas no modelo do Plano de Lançamento de Caminhões de Vendas. 
3. Personalize o título, camadas, categorias e entradas para se adequarem ao seu projeto
   Ou apague o que não precisa. 
4. Clique em **Aplicar** e salve a página. 

## Manter camadas

1. No Editor de Planos, abra a aba **Camadas**. 
2. Para criar uma camada, clique em **Nova Camada** e entre
   Digite o nome dela. 
3. Para renomear uma camada, mude seu nome diretamente na lista. 
   Ao lado de cada nome está quantas entradas a camada contém. 
4. Para mudar a ordem, mova a camada com as setas
   Para cima ou para baixo. A ordem aqui é a ordem no
   página e na exportação do Excel. 
5. Para deletar uma camada, clique em **Excluir**. Ela ainda contém
   entradas, o editor pergunta se elas são movidas para outra camada
   — que você seleciona em **Nível Alvo** — ou se também são excluídos
   . Confirme com **Excluir** ou interrompa com **Cancelar** 
   . 

## Manter categorias

1. No editor de planos, abra a aba **Categorias**. 
2. Para criar uma categoria, clique em **Nova categoria** e
   Digite o nome deles. 
3. Em **Cor**, selecione uma das doze amostras de cor ou entre
   **Valor Hex** insere sua própria cor, por exemplo '#E40045'. 
4. Para mudar a ordem da legenda, mova a categoria
   com as setas apontando para cima ou para baixo. 
5. Para deletar uma categoria, clique em **Excluir**. Suas inscrições
   são mantidas e tornam-se "sem categoria" (cinza); a consulta menciona, 
   quantas entradas isso afeta. 

## Crie um marco

1. No editor de planos, abra a aba **Entradas**. 
2. Em **Adicionar**, clique em **Marco**. O novo
   A entrada se chama "Novo Marco", está no meio da prévia e em
   do primeiro nível; à direita aparece sua forma. 
3. Insira o **título** e, opcionalmente, uma **descrição**. O
   A descrição aparece nos detalhes, os quebras de linha são mantidas. 
4. Selecione o **Nível** e a **Categoria** — ou "Sem Categoria". 
5. Digite a **data**. 
6. Em **Símbolo**, selecione Diamante, Triângulo, Quadrado ou Círculo. 
7. Defina **Provisório** caso a data ainda não esteja definida. 
8. Clique em **Aplicar** assim que todas as inscrições estiverem prontas. 

## Crie um período de tempo

1. Na aba **Entradas**, em **Adicionar**, clique
   **Ponto final**. A nova entrada será chamada de "Novo Período". 
2. Insira **Título**, opcional **Descrição**, **Nível** e
   **Categoria**. 
3. Insira **Início** e **Fim**. Ambos os dias pertencem ao período. 
4. Coloque **seta no final** se o período já passar do fim
   continua. 
5. Defina **Provisório** caso o início ou o fim ainda não estejam definidos. 

Um marco pode ser alterado para um período de tempo a qualquer momento sob **Arte**
E vice-versa. 

## Crie um prazo

1. Na aba **Entradas**, em **Adicionar**, clique
   **Prazo**. 
2. Insira **Título**, opcional **Descrição**, **Categoria** e
   **Data**. Não há nível aqui: Uma data limite se aplica ao
   O plano completo e passa por todos os níveis. 

Se um marco ou período sob **Arte** se tornar a data limite, ele não se aplica.
nivelado. 

## Inscrições combinadas em uma série

1. Na aba **Entradas**, selecione a primeira entrada da série. 
2. Insira um nome em **Série**, por exemplo "TG Assist MY26". 
3. Selecione a próxima entrada da mesma camada e insira sob
   **Série** é exatamente o mesmo nome. O campo sugere a série que
   já existe nesse nível. 
4. Repita o passo 3 para todas as entradas da série. 

Séries se aplicam apenas em um nível. Procure por idênticas
Grafia: "TG Assist MY26" e "TG-Assist MY26" são duas coisas diferentes
série. 

## Defina uma dependência

1. Na aba **Entradas**, selecione a entrada que foi criada por outro
   (o sucessor). 
2. Em **Depende de**, encontre e selecione o antecessor. Múltiplos
   Predecessores são possíveis. 
3. Na página, uma linha pontilhada com uma seta agora conecta o
   Predecessor com sucessor. 

Dependências existem apenas entre marcos e períodos de tempo, não para
prazos. Se uma entrada for excluída, ela também desaparecerá de todos os prazos
Dependências. 

## Duplicar e excluir entradas

1. Selecione a entrada na aba **Entradas**. 
2. **Duplicar** cria uma cópia, que você então ajusta. 
3. **Delete** remove a entrada e todas as dependências que estão nela
   Show. 

## Defina a visualização principal

Sem uma visualização inicial, o widget mostra o plano completo ao carregar. Deveria
Em vez disso, mostre um certo trecho, por exemplo, os próximos dois anos: 

1. Amplie e panoramize a **Prévia** no Editor de Planos até que o
   pode ser visto na seção desejada. 
2. Clique em **Esta seção como visualização inicial**. Salvando
   Ao mês. 
3. Para mostrar o plano completo novamente, clique em **Iniciar visualização
   Remover**. 
4. **Aplicar**, salvar, verificar na prévia da página. 

Leitores podem dar zoom a qualquer momento a partir da visualização inicial ou
**Mostrar tudo** veja o plano completo. 

## Mudança depois

1. Abra novamente as configurações do widget. O Editor de Planos mostrará o
   Plano salvo. 
2. Selecione a entrada na lista da aba **Entradas** ou por
   Clique na prévia e modifique sua forma. 
3. Clique em **Aplicar** e salve a página. A data
   após "Status:" ser definido para o dia da mudança. 

Clique em **Cancelar** para descartar todas as alterações desde a última vez que você abriu o
Editores de Planos. 

## Baixe o plano como uma planilha Excel (como leitor)

1. Filtre e amplie o plano para que você possa ver o que precisa. 
2. Clique em **Export** na barra de ferramentas. No modo estreito
   telas, o botão está no menu **Mais**. 
3. Escolha o escopo: 
   - **Visualização Atual** — apenas as entradas na seção visível que
     atender a todos os filtros ativos; se a busca estiver ativa, apenas os resultados. 
   - **Plano completo** — todas as entradas, sem filtros e seções. 

   Por trás de cada eleição está quantas entradas ela contém. 
4. Clique em **Download Excel**. O arquivo tem um nome semelhante ao
   Cabeça do plano com a data de hoje, sem cabeça
   'Projektplan_JJJJ-MM-TT.xlsx'. 

O arquivo contém a folha **Planejamento** com uma linha por entrada (nível, 
Tipo, Título, Categoria, Início, Fim, Série, Preliminar, Predecessor, 
descrição) e a folha **Info** com título, status, data de exportação, escopo e
Os filtros ativos. 

## Quando algo não funciona

1. **O widget não mostra nada na página.** O plano ainda não tem um.
   entrada. Abra Configurações e defina pelo menos uma
   Marco, período de tempo ou prazo. 
2. **O editor de planos não abre.** Em **Plan** há apenas um
   Caixa de texto. Feche e reabra as configurações. Mudar
   Não altere o conteúdo do campo de texto manualmente — é o tecnico
   Versão aproximada do plano. 
3. **No topo do editor de plantas, diz que as entradas não puderam ser lidas.** 
   Veja o FAQ deste relatório. 
4. **Leitores não conseguem encontrar o botão "Exportar".** Verifique se
   **Oferecer Exportação do Excel** está ativada.