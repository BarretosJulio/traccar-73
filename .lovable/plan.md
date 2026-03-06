

## "Mais Detalhes" como Dialog em vez de Página

### Problema
O link "Mais Detalhes" no StatusCard navega para `/app/position/:id` (PositionPage), que abre uma página inteira. Isso quebra o contexto do mapa e causa 401 em certos cenários. O usuário quer que abra como popup/dialog flutuante, consistente com o padrão visual do app.

### Solução
Transformar a exibição de detalhes da posição em um **Dialog** inline no próprio StatusCard, sem navegar para outra rota.

### Alterações

**1. `src/common/components/StatusCard.jsx`**
- Adicionar estado `const [positionDialogOpen, setPositionDialogOpen] = useState(false)`
- Trocar o `<Link component={RouterLink} to={...}>` por um `<Link href="#" onClick={() => setPositionDialogOpen(true)}>`
- Adicionar um `<Dialog>` no final do componente que renderiza a tabela de posição (mesma lógica do PositionPage) usando os dados de `position` já disponíveis no componente — sem fetch adicional
- O dialog terá: título com nome do dispositivo, tabela com parâmetro/nome/valor, botão fechar
- Usar `maxWidth="sm"` e `fullWidth` para visual consistente

**2. Dados**
- O StatusCard já tem o objeto `position` completo com todos os atributos — não precisa de chamada API
- Importar `usePositionAttributes` e `PositionValue` para renderizar a tabela idêntica à PositionPage

### Resultado
- Zero navegação, zero fetch, zero risco de 401
- Detalhes aparecem como popup flutuante sobre o mapa
- Consistente com o padrão visual dos outros dialogs do app

