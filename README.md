# Sistema de Controle de Ponto

Este é um sistema de controle de ponto que permite aos usuários registrar e gerenciar seus horários de entrada e saída, bem como visualizar relatórios detalhados. O sistema foi projetado para ser intuitivo e eficiente, fornecendo todas as funcionalidades necessárias para o controle de horas trabalhadas.

## Funcionalidades

- **Visualização da Data e Hora Atual**: O usuário pode visualizar a data e hora atuais na página principal do sistema.
  
- **Registro de Ponto**: 
  - Registro de ponto de entrada e saída do expediente.
  - Registro de ponto de entrada e saída do intervalo.

- **Registro de Ponto no Passado**: O usuário pode registrar um ponto em dias anteriores ao atual. Esse registro possuirá uma marcação diferenciada para fácil identificação.

- **Restrições de Data**: Não é permitida a marcação de ponto em data futura.

- **Justificativa de Ausência**: O usuário pode registrar uma justificativa para uma ausência, com a possibilidade de fazer upload de um arquivo comprovante.

- **Relatório de Horários**: O sistema permite visualizar um relatório com os horários de entrada e saída, incluindo intervalos.

- **Marcação Automática com Data, Hora e Localização**: Por padrão, as marcações de entrada e saída de expediente e intervalo consideram a data, hora e localização atuais do usuário no momento do registro.

- **Observações em Registros**: O usuário pode adicionar observações a um registro, e esses registros terão uma marcação diferenciada.

- **Alerta de Carga Horária Excedida**: O usuário pode ser alertado quando a carga horária for ultrapassada.

- **Cálculo de Salário**: É possível definir um valor por hora para o usuário e calcular o salário parcial em uma data específica, de acordo com os dias e horas trabalhadas.

- **Saldo de Horas Trabalhadas**: O usuário pode visualizar o saldo de horas trabalhadas.

- **Edição de Registros**: O usuário pode editar registros já feitos. Esses registros editados terão uma marcação diferenciada.

## Restrições

- **Data Futura**: Não deve ser permitida a marcação de ponto em datas futuras.
  
- **Exclusão de Marcações**: O usuário não deve poder excluir uma marcação.

## Tecnologias Utilizadas

- [Lista de Tecnologias que serão usadas no desenvolvimento, ex: HTML, CSS, JavaScript, Frameworks, etc.]

## Como Contribuir

1. Faça um fork do projeto.
2. Crie um branch para sua feature: `git checkout -b minha-feature`.
3. Commit suas mudanças: `git commit -m 'Adicionando minha feature'`.
4. Push para o branch: `git push origin minha-feature`.
5. Abra um Pull Request.

## Licença

Este projeto está sob a licença [Nome da Licença].

