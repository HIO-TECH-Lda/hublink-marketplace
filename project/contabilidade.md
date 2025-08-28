Especificação de Funcionamento - Módulo de Contabilidade Simplificado
1. Visão Geral
Este documento detalha o funcionamento do módulo de contabilidade simplificado a ser integrado no painel do vendedor do marketplace Mulungo/Txova. O objetivo é fornecer uma ferramenta de gestão financeira básica para vendedores que não utilizam sistemas de ERP externos, permitindo que eles registem e visualizem tanto as transações da plataforma quanto as vendas externas, despesas e relatórios financeiros simplificados.

2. Funcionalidades Principais
O módulo será dividido em quatro seções principais: Dashboard, Vendas, Despesas e Relatórios.

2.1. Dashboard Contábil
Visão Geral Rápida: Um painel inicial com métricas financeiras essenciais.

Métricas:

Receita Total (Últimos 30 dias): Soma de todas as vendas (plataforma + externas).

Despesas Totais (Últimos 30 dias): Soma de todas as despesas registadas.

Lucro Líquido Estimado: Receita Total - Despesas Totais.

Vendas na Plataforma vs. Vendas Externas: Um gráfico de barras ou pizza para comparar as fontes de receita.

Alerta: Um componente de destaque para avisos importantes, como "Pagamentos pendentes" ou "Repasse programado para a próxima semana".

2.2. Gestão de Vendas
Esta seção permitirá ao vendedor visualizar e gerir as suas vendas.

Sincronização Automática: As vendas realizadas diretamente no marketplace Mulungo/Txova serão automaticamente importadas para este módulo.

Registo de Vendas Externas:

Formulário Simples: Um formulário que permite ao vendedor registar vendas feitas fora da plataforma.

Campos: Descrição do Item, Valor da Venda, Data da Venda, Cliente (opcional).

Tabela de Vendas: Uma tabela interativa que lista todas as transações, com filtros por data e fonte (Plataforma vs. Externas).

2.3. Gestão de Despesas
Esta seção permite ao vendedor registar e categorizar as suas despesas.

Formulário de Registo: Um formulário para adicionar novas despesas.

Campos: Descrição da Despesa, Valor, Data, Categoria (e.g., Aluguel, Materiais, Marketing, Logística, Taxas), Comprovativo (campo opcional para upload de ficheiros de imagem ou PDF).

Tabela de Despesas: Uma tabela que lista todas as despesas, com filtros por categoria e período.

2.4. Relatórios Simplificados
Relatórios visuais e de fácil compreensão para ajudar o vendedor na tomada de decisões.

Relatório de Receita e Despesa: Um gráfico de linhas que mostra a evolução da receita e das despesas ao longo do tempo (e.g., mensalmente).

Relatório de Lucro: Um gráfico de lucro líquido estimado, mostrando os resultados por período.

Relatório de Categorias de Despesa: Um gráfico de pizza ou barras que distribui as despesas por categoria, ajudando o vendedor a identificar onde estão os seus maiores gastos.

Exportação: Opção para exportar os relatórios em formatos como PDF ou CSV.

3. Fluxo de Funcionamento Proposto
O vendedor acede ao painel de administração e encontra a nova secção de "Contabilidade".

As vendas realizadas no marketplace são automaticamente populadas na tabela de Vendas.

O vendedor pode, a qualquer momento, ir para a seção "Vendas" e registar manualmente uma venda externa.

Da mesma forma, o vendedor pode ir para a seção "Despesas" e registar uma despesa, categorizando-a para análise futura.

O vendedor pode consultar o "Dashboard" e os "Relatórios" para obter uma visão geral da sua saúde financeira.

4. Próximos Passos
Validação: Discutir este documento com o stakeholder para validar a proposta e ajustar funcionalidades conforme necessário.

Desenvolvimento: Iniciar o design da interface (UI/UX) para as telas do módulo.

Implementação: Adicionar a funcionalidade na próxima sprint, focando na integração com os dados de vendas da plataforma.