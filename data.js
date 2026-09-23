// Conteúdo do app (seções, tabelas, textos e calculadoras).
// Este arquivo é gerado pelo editor do administrador (EDITAR-APP.bat).
// Valores são de referência: confira sempre o catálogo do fabricante.

const DEFAULT_DATA = {
  "version": 1,
  "settings": {
    "appName": "MecaNotas",
    "theme": "industrial",
    "accent": "",
    "mascot": true
  },
  "sections": [
    {
      "id": "rolamentos",
      "title": "Rolamentos",
      "icon": "⚙️",
      "blocks": [
        {
          "type": "text",
          "title": "Como ler o código do rolamento",
          "text": "Exemplo: **6205-2RS C3**\n**6** = tipo (rígido de esferas)\n**2** = série de dimensão (0 = extra-leve, 2 = leve, 3 = média, 4 = pesada)\n**05** = furo → 05 × 5 = **25 mm**\nFuros especiais: 00 = 10 mm · 01 = 12 mm · 02 = 15 mm · 03 = 17 mm. A partir de 04, multiplique por 5.\n**2RS** = vedação de borracha dos dois lados · **C3** = folga interna maior que a normal",
          "id": "rolamentos-1"
        },
        {
          "type": "table",
          "title": "Tipos de rolamento (1º dígito / prefixo)",
          "columns": ["Código", "Tipo", "Uso típico"],
          "rows": [
            ["1xxx", "Autocompensador de esferas", "Eixos com flexão ou desalinhamento"],
            ["2xxxx (22xxx, 23xxx)", "Autocompensador de rolos", "Cargas pesadas, peneiras, ventiladores, mancais bipartidos"],
            ["3xxxx (302xx, 322xx)", "Rolos cônicos", "Carga radial + axial, cubos de roda, redutores"],
            ["4xxx", "Rígido de esferas, duas carreiras", "Carga radial maior"],
            ["5xxxx (511xx)", "Axial de esferas", "Somente carga axial"],
            ["6xxx", "Rígido de esferas", "Uso geral, motores elétricos, bombas"],
            ["7xxx", "Contato angular de esferas", "Carga combinada, bombas, fusos (montado aos pares)"],
            ["NU / NJ / NUP / N", "Rolos cilíndricos", "Alta carga radial, motores grandes"],
            ["NA / NK / HK", "Agulhas", "Pouco espaço radial"],
            ["29xxx", "Axial autocompensador de rolos", "Alta carga axial"],
            ["UC / UCP / UCF", "Rolamento de inserção / mancal", "Transportadores, máquinas agrícolas"]
          ],
          "id": "rolamentos-2"
        },
        {
          "type": "table",
          "title": "Série 60 (extra-leve)",
          "columns": ["Código", "d furo (mm)", "D externo (mm)", "B largura (mm)"],
          "rows": [
            ["6000", "10", "26", "8"],
            ["6001", "12", "28", "8"],
            ["6002", "15", "32", "9"],
            ["6003", "17", "35", "10"],
            ["6004", "20", "42", "12"],
            ["6005", "25", "47", "12"],
            ["6006", "30", "55", "13"],
            ["6007", "35", "62", "14"],
            ["6008", "40", "68", "15"],
            ["6009", "45", "75", "16"],
            ["6010", "50", "80", "16"],
            ["6011", "55", "90", "18"],
            ["6012", "60", "95", "18"]
          ],
          "id": "rolamentos-3"
        },
        {
          "type": "table",
          "title": "Série 62 (leve)",
          "columns": ["Código", "d furo (mm)", "D externo (mm)", "B largura (mm)"],
          "rows": [
            ["6200", "10", "30", "9"],
            ["6201", "12", "32", "10"],
            ["6202", "15", "35", "11"],
            ["6203", "17", "40", "12"],
            ["6204", "20", "47", "14"],
            ["6205", "25", "52", "15"],
            ["6206", "30", "62", "16"],
            ["6207", "35", "72", "17"],
            ["6208", "40", "80", "18"],
            ["6209", "45", "85", "19"],
            ["6210", "50", "90", "20"],
            ["6211", "55", "100", "21"],
            ["6212", "60", "110", "22"],
            ["6213", "65", "120", "23"],
            ["6214", "70", "125", "24"],
            ["6215", "75", "130", "25"]
          ],
          "id": "rolamentos-4"
        },
        {
          "type": "table",
          "title": "Série 63 (média)",
          "columns": ["Código", "d furo (mm)", "D externo (mm)", "B largura (mm)"],
          "rows": [
            ["6300", "10", "35", "11"],
            ["6301", "12", "37", "12"],
            ["6302", "15", "42", "13"],
            ["6303", "17", "47", "14"],
            ["6304", "20", "52", "15"],
            ["6305", "25", "62", "17"],
            ["6306", "30", "72", "19"],
            ["6307", "35", "80", "21"],
            ["6308", "40", "90", "23"],
            ["6309", "45", "100", "25"],
            ["6310", "50", "110", "27"],
            ["6311", "55", "120", "29"],
            ["6312", "60", "130", "31"],
            ["6313", "65", "140", "33"],
            ["6314", "70", "150", "35"],
            ["6315", "75", "160", "37"]
          ],
          "id": "rolamentos-5"
        },
        {
          "type": "table",
          "title": "Sufixos mais comuns",
          "columns": ["Sufixo", "Significado"],
          "rows": [
            ["Z / ZZ / 2Z", "Placa de proteção metálica (um / dois lados)"],
            ["RS / 2RS / 2RSH / DDU / LLU", "Vedação de borracha (um / dois lados)"],
            ["C3", "Folga interna maior que a normal (comum em motores elétricos)"],
            ["C4", "Folga interna maior que C3 (alta temperatura)"],
            ["K", "Furo cônico 1:12 (montagem com bucha)"],
            ["N", "Ranhura para anel elástico no anel externo"],
            ["NR", "Ranhura + anel elástico"],
            ["E", "Projeto reforçado (maior capacidade)"],
            ["M / MA / MB", "Gaiola de latão"],
            ["J / JN", "Gaiola de aço estampado"],
            ["TN9 / TVH", "Gaiola de poliamida"],
            ["W33", "Canal e furos de lubrificação no anel externo"],
            ["VL0241", "Isolado eletricamente (motores com inversor)"]
          ],
          "id": "rolamentos-6"
        },
        {
          "type": "calc",
          "calc": "graxa",
          "id": "rolamentos-7"
        },
        {
          "type": "text",
          "title": "Dicas de montagem",
          "text": "• Aquecer por **indução** ou banho de óleo, no máximo **110–120 °C**. Nunca use maçarico direto.\n• Aplique força **somente no anel que tem interferência**. Nunca bata pelas esferas.\n• Eixo girando → anel interno com interferência, anel externo deslizante na caixa.\n• Graxa: preencher de **30 a 50%** do espaço livre da caixa (rotação alta = menos graxa).\n• Temperatura normal da caixa em operação: até cerca de 70–80 °C.\n• Nunca gire um rolamento seco com ar comprimido.\n• Guarde o rolamento na embalagem até a hora de montar.",
          "id": "rolamentos-8"
        }
      ],
      "image": "icons/secoes/rolamentos.webp?v=muelerzw"
    },
    {
      "id": "retentores",
      "title": "Retentores",
      "icon": "⭕",
      "blocks": [
        {
          "type": "text",
          "title": "Como medir e especificar",
          "text": "Medida = **eixo × alojamento × largura** (d × D × b). Ex.: **35x52x7**\n• Meça o eixo onde o lábio trabalha (fora da região gasta).\n• Meça o alojamento (furo da caixa) e a largura do retentor antigo.\n• Eixo com sulco (marca do lábio): use luva de reparo (tipo Speedi-Sleeve) ou monte o retentor novo deslocado alguns milímetros.\n• Anote material (NBR, FKM/Viton) e tipo (com ou sem lábio contra pó).",
          "id": "retentores-9"
        },
        {
          "type": "table",
          "title": "Tipos (DIN 3760 / ISO 6194)",
          "columns": ["Tipo", "Construção", "Uso"],
          "rows": [
            ["A", "Externo revestido de borracha, lábio simples com mola", "Uso geral, melhor vedação estática no alojamento"],
            ["AS", "Igual ao A + lábio contra pó", "Ambiente com poeira/sujeira"],
            ["B", "Externo metálico, lábio simples com mola", "Alojamento usinado com precisão"],
            ["BS", "Igual ao B + lábio contra pó", "Poeira + alojamento preciso"],
            ["C", "Externo metálico com tampa de reforço", "Serviço pesado"],
            ["CS", "Igual ao C + lábio contra pó", "Serviço pesado com poeira"]
          ],
          "id": "retentores-a"
        },
        {
          "type": "table",
          "title": "Materiais",
          "columns": ["Material", "Temperatura", "Aplicação"],
          "rows": [
            ["NBR (nitrílica)", "-40 a +100 °C", "Óleo mineral, graxa, água. Uso geral e mais barato"],
            ["FKM (Viton®)", "-20 a +200 °C", "Alta temperatura, químicos, óleos sintéticos"],
            ["HNBR", "-30 a +150 °C", "Melhor que NBR em temperatura e desgaste"],
            ["ACM (poliacrílica)", "-25 a +150 °C", "Óleos com aditivos. Não usar com água"],
            ["VMQ (silicone)", "-50 a +150 °C", "Baixa/alta temperatura, pouca resistência ao desgaste"],
            ["PTFE", "-80 a +200 °C", "Químicos agressivos, trabalho a seco, alta velocidade"]
          ],
          "id": "retentores-b"
        },
        {
          "type": "table",
          "title": "Medidas comuns (referência)",
          "columns": ["Medida (d×D×b)", "Obs."],
          "rows": [
            ["20x35x7", ""],
            ["20x40x7", ""],
            ["25x40x7", ""],
            ["25x42x7", ""],
            ["30x42x7", ""],
            ["30x47x7", ""],
            ["35x50x7", ""],
            ["35x52x7", ""],
            ["40x55x8", ""],
            ["40x62x8", ""],
            ["45x62x8", ""],
            ["45x65x8", ""],
            ["50x68x8", ""],
            ["50x72x8", ""],
            ["55x72x8", ""],
            ["55x80x8", ""],
            ["60x80x8", ""],
            ["60x85x8", ""],
            ["65x85x10", ""],
            ["70x90x10", ""],
            ["75x95x10", ""],
            ["80x100x10", ""],
            ["90x110x12", ""],
            ["100x120x12", ""]
          ],
          "id": "retentores-c"
        },
        {
          "type": "table",
          "title": "Meus retentores (equipamentos da planta)",
          "columns": ["Equipamento / TAG", "Medida", "Material", "Código fabricante", "Obs."],
          "rows": [
            ["Exemplo: Bomba B-101 lado acoplamento", "35x52x7", "NBR", "", "Edite ou apague esta linha"]
          ],
          "id": "retentores-d"
        },
        {
          "type": "text",
          "title": "Dicas de montagem",
          "text": "• Lubrifique o lábio antes de montar.\n• **Mola voltada para o lado do fluido** a ser vedado.\n• Proteja rasgos de chaveta e roscas com fita ou luva de montagem.\n• Prense por igual, com bucha/ferramenta que apoie no anel externo. Nunca bata direto.\n• Eixo ideal: rugosidade Ra 0,2 a 0,8 µm, dureza mínima 45 HRC, com chanfro de entrada.",
          "id": "retentores-e"
        }
      ]
    },
    {
      "id": "correias",
      "title": "Correias e polias",
      "icon": "🔁",
      "blocks": [
        {
          "type": "calc",
          "calc": "correia",
          "id": "correias-f"
        },
        {
          "type": "calc",
          "calc": "distancia",
          "id": "correias-g"
        },
        {
          "type": "calc",
          "calc": "rpm",
          "id": "correias-h"
        },
        {
          "type": "text",
          "title": "Como medir sem fórmula",
          "text": "1. Coloque as polias na posição de trabalho (motor no meio do curso do esticador).\n2. Passe um barbante ou trena de costura **no fundo do canal** (ou na linha média da correia) em volta das duas polias.\n3. A medida obtida é aproximadamente o **comprimento primitivo/efetivo**.\n4. Para correias clássicas A, B, C: desconte a diferença da tabela abaixo para achar o comprimento interno e divida por 25,4 para achar o número em polegadas (ex.: A-48).\nDica: se tiver a correia velha, leia o código gravado nela. Correia gasta estica, então não confie só na medida dela.",
          "id": "correias-i"
        },
        {
          "type": "table",
          "title": "Perfis de correia em V",
          "columns": ["Perfil", "Largura (mm)", "Altura (mm)", "Ø mín. polia (mm)", "Tipo"],
          "rows": [
            ["Z", "10", "6", "50", "Clássica"],
            ["A", "13", "8", "75", "Clássica"],
            ["B", "17", "11", "125", "Clássica"],
            ["C", "22", "14", "200", "Clássica"],
            ["D", "32", "19", "355", "Clássica"],
            ["E", "38", "25", "500", "Clássica"],
            ["SPZ", "9,7", "8", "63", "Estreita (ISO)"],
            ["SPA", "12,7", "10", "90", "Estreita (ISO)"],
            ["SPB", "16,3", "13", "140", "Estreita (ISO)"],
            ["SPC", "22", "18", "224", "Estreita (ISO)"],
            ["3V / 9N", "9,5", "8", "67", "Estreita (RMA)"],
            ["5V / 15N", "15,9", "13,5", "180", "Estreita (RMA)"],
            ["8V / 25N", "25,4", "23", "315", "Estreita (RMA)"]
          ],
          "id": "correias-j"
        },
        {
          "type": "table",
          "title": "Comprimento interno → primitivo (clássicas)",
          "columns": ["Perfil", "Somar ao interno", "Exemplo"],
          "rows": [
            ["A", "≈ 33 mm (1,3\")", "A-40: interno 1016 mm → primitivo ≈ 1049 mm"],
            ["B", "≈ 46 mm (1,8\")", "B-60: interno 1524 mm → primitivo ≈ 1570 mm"],
            ["C", "≈ 74 mm (2,9\")", "C-90: interno 2286 mm → primitivo ≈ 2360 mm"],
            ["D", "≈ 84 mm (3,3\")", ""],
            ["SPZ/SPA/SPB/SPC", "Número já é o Ld em mm", "SPB 2000 = 2000 mm primitivo"]
          ],
          "id": "correias-k"
        },
        {
          "type": "text",
          "title": "Tensionamento e alinhamento",
          "text": "• **Regra da flecha**: aplique força no meio do vão. A correia deve baixar cerca de **16 mm para cada 1 metro de vão** (1/64 do vão).\n• Tensione de novo depois de 24 a 48 h de trabalho (amaciamento).\n• Troque **o jogo completo** de correias em transmissões múltiplas. Nunca misture correia nova com velha.\n• Alinhe as polias com régua ou laser. Desalinhamento máximo de cerca de 0,5° (≈ 1 mm a cada 100 mm).\n• Correia chiando na partida: tensão baixa ou polia com canal gasto (verifique com gabarito).",
          "id": "correias-l"
        }
      ]
    },
    {
      "id": "selos",
      "title": "Selos mecânicos",
      "icon": "🛞",
      "blocks": [
        {
          "type": "text",
          "title": "Conceitos básicos",
          "text": "• Vedação feita por **duas faces planas** (uma gira, outra fica parada) com um filme fino de líquido entre elas.\n• **Desbalanceado**: mais simples, para pressões baixas (até cerca de 10 bar).\n• **Balanceado**: reduz a força nas faces, para pressões mais altas.\n• **Cartucho**: vem pré-montado e regulado, o que reduz erro de montagem.\n• **Nunca opere a seco**, nem por poucos segundos.\n• Antes de montar, verifique: batimento do eixo ≤ 0,05 mm, folga axial conforme fabricante, eixo sem riscos na região dos o-rings.\n• Selo de componente: respeite a **cota de montagem** do desenho do fabricante.",
          "id": "selos-m"
        },
        {
          "type": "table",
          "title": "Materiais das faces",
          "columns": ["Material", "Características", "Uso"],
          "rows": [
            ["Carbono-grafite", "Autolubrificante, macio", "Uso geral. Evitar abrasivos"],
            ["Carbeto de silício (SiC)", "Muito duro, boa troca de calor, resistente a químicos", "Químicos, abrasivos, uso geral"],
            ["Carbeto de tungstênio (WC)", "Muito duro e tenaz, resiste a choque", "Abrasivos, alta pressão"],
            ["Cerâmica (Al₂O₃)", "Dura, barata, frágil a choque térmico", "Água limpa, bombas pequenas"],
            ["Carbono × SiC", "Combinação mais usada", "Água, óleos, químicos leves"],
            ["SiC × SiC / WC × WC", "Duro × duro", "Fluidos com sólidos/abrasivos"]
          ],
          "id": "selos-n"
        },
        {
          "type": "table",
          "title": "Planos de selagem API 682 (principais)",
          "columns": ["Plano", "Descrição", "Quando usar"],
          "rows": [
            ["01", "Recirculação interna da descarga para a câmara", "Fluidos limpos, bombas ANSI"],
            ["02", "Câmara sem circulação (fechada)", "Fluidos limpos, baixa temperatura"],
            ["11", "Da descarga para a câmara, via orifício", "O mais comum, fluidos limpos"],
            ["13", "Da câmara para a sucção", "Bombas verticais, retirar ar/vapor"],
            ["21", "Como o 11, com trocador de calor", "Fluido quente"],
            ["23", "Anel bombeador + trocador em circuito fechado", "Água quente, alimentação de caldeira"],
            ["31", "Da descarga via separador ciclone", "Fluido com sólidos mais pesados"],
            ["32", "Injeção de fluido limpo externo", "Fluidos sujos, abrasivos, polímeros"],
            ["52", "Selo duplo, buffer NÃO pressurizado (reservatório)", "Fluidos perigosos/voláteis"],
            ["53A", "Selo duplo, barreira pressurizada por N₂ no reservatório", "Fluidos perigosos, tóxicos"],
            ["54", "Barreira pressurizada por sistema externo", "Grandes instalações, várias bombas"],
            ["62", "Quench externo (vapor, água, N₂) no lado atmosférico", "Evitar cristalização, coque, gelo"],
            ["74", "Selo duplo com barreira de gás pressurizado", "Onde não se aceita contaminação líquida"]
          ],
          "id": "selos-o"
        },
        {
          "type": "table",
          "title": "Diagnóstico de falhas",
          "columns": ["Sintoma", "Causa provável", "Ação"],
          "rows": [
            ["Vazamento constante desde a partida", "Face trincada, o-ring danificado, cota de montagem errada", "Desmontar, conferir cota e peças"],
            ["Vazamento intermitente", "Desalinhamento, vibração, eixo empenado, cavitação", "Alinhar, medir vibração e batimento"],
            ["Faces com trincas térmicas / marcas de calor", "Operação a seco, falta de flush/refrigeração", "Verificar escorva e plano de selagem"],
            ["Bordas do carbono lascadas", "Vaporização na face (flashing), golpes de pressão", "Aumentar pressão na câmara, refrigerar"],
            ["Desgaste rápido das faces", "Sólidos abrasivos, pressão acima do projeto", "Faces duras, plano 32 ou 31"],
            ["O-ring inchado, duro ou rachado", "Material incompatível com fluido ou temperatura", "Trocar elastômero (FKM, EPDM, FFKM)"],
            ["Mola quebrada ou travada", "Corrosão, sólidos, cristalização", "Mola única, fole ou quench (plano 62)"]
          ],
          "id": "selos-p"
        },
        {
          "type": "table",
          "title": "Meus selos (equipamentos da planta)",
          "columns": ["Equipamento / TAG", "Modelo / Fabricante", "Ø eixo (mm)", "Faces / Elastômero", "Plano API", "Obs."],
          "rows": [
            ["Exemplo: Bomba B-101", "Cartucho simples", "45", "Carbono × SiC / FKM", "11", "Edite ou apague esta linha"]
          ],
          "id": "selos-q"
        }
      ],
      "image": "icons/secoes/selos.webp?v=mueldm8o"
    },
    {
      "id": "bombas",
      "title": "Bombas centrífugas",
      "icon": "💧",
      "blocks": [
        {
          "type": "table",
          "title": "Problemas e soluções",
          "columns": ["Problema", "Causas prováveis", "O que verificar"],
          "rows": [
            ["Não bombeia", "Sem escorva, rotação invertida, válvula fechada, entrada de ar na sucção", "Escorvar, sentido de giro, válvulas, juntas da sucção"],
            ["Vazão / pressão baixa", "Rotor gasto, folga grande no anel de desgaste, filtro sujo, rotação baixa", "Folgas, filtro, rpm do motor"],
            ["Ruído de \"pedras\" (cavitação)", "NPSH disponível baixo, sucção obstruída, fluido quente", "Nível do tanque, filtro, válvula da sucção toda aberta"],
            ["Vibração alta", "Desalinhamento, rolamento ruim, rotor desbalanceado, pé manco, cavitação", "Alinhamento, base, rolamentos, ponto de operação"],
            ["Mancal aquecendo", "Graxa em excesso ou falta, óleo contaminado, desalinhamento", "Lubrificação, alinhamento, folga do rolamento"],
            ["Motor sobrecarregado", "Vazão acima do projeto, fluido mais denso/viscoso, atrito interno", "Corrente, válvula de descarga, rotor raspando"],
            ["Vazamento no selo", "Ver seção Selos mecânicos", ""],
            ["Gaxeta esquentando", "Aperto excessivo, falta de água de selagem", "Afrouxar e deixar gotejar (40 a 60 gotas/min)"]
          ],
          "id": "bombas-r"
        },
        {
          "type": "calc",
          "calc": "afinidade",
          "id": "bombas-s"
        },
        {
          "type": "calc",
          "calc": "potencia",
          "id": "bombas-t"
        },
        {
          "type": "text",
          "title": "Cavitação e NPSH",
          "text": "• **NPSH disponível** (instalação) deve ser maior que o **NPSH requerido** (curva da bomba) com margem mínima de cerca de 0,5 a 1 m.\n• Tubulação de sucção: diâmetro igual ou maior que o bocal, curta, com trecho reto de 5 a 10 diâmetros antes da bomba.\n• Redução na sucção: **excêntrica, lado reto para cima**, para não formar bolsa de ar.\n• Nunca estrangule a válvula de sucção para controlar vazão. Regule pela descarga.",
          "id": "bombas-u"
        },
        {
          "type": "table",
          "title": "Tolerâncias de alinhamento (acoplamento flexível curto, referência)",
          "columns": ["Rotação (rpm)", "Paralelo aceitável (mm)", "Paralelo excelente (mm)", "Angular aceitável (mm/100 mm)", "Angular excelente (mm/100 mm)"],
          "rows": [
            ["750", "0,19", "0,09", "0,13", "0,09"],
            ["1500", "0,09", "0,06", "0,07", "0,05"],
            ["3000", "0,06", "0,03", "0,04", "0,03"],
            ["6000", "0,03", "0,02", "0,03", "0,02"]
          ],
          "id": "bombas-v"
        }
      ]
    },
    {
      "id": "valvulas",
      "title": "Válvulas",
      "icon": "🚰",
      "blocks": [
        {
          "type": "table",
          "title": "Tipos e aplicações",
          "columns": ["Tipo", "Função", "Observações"],
          "rows": [
            ["Gaveta", "Bloqueio (toda aberta ou toda fechada)", "Não usar para regular vazão, pois a cunha sofre erosão"],
            ["Globo", "Regulagem de vazão", "Perda de carga alta, respeitar sentido da seta"],
            ["Esfera", "Bloqueio rápido (1/4 de volta)", "Passagem plena ou reduzida. Regulagem ruim"],
            ["Borboleta", "Bloqueio e regulagem em grandes diâmetros", "Compacta (wafer / lug), leve"],
            ["Retenção", "Impede o fluxo reverso", "Portinhola, pistão, dupla porta. Montar no sentido da seta"],
            ["Agulha", "Regulagem fina", "Instrumentação, pequenas vazões"],
            ["Diafragma", "Bloqueio/regulagem", "Fluidos corrosivos, abrasivos, sanitários"],
            ["Macho (plug)", "Bloqueio 1/4 de volta", "Fluidos com sólidos, lamas"],
            ["Segurança / alívio (PSV)", "Protege contra sobrepressão", "Segurança: abre de uma vez (gás/vapor). Alívio: abre proporcional (líquido)"],
            ["Redutora de pressão", "Mantém pressão menor a jusante", "Usar filtro antes"],
            ["Pé com crivo", "Retenção + filtro na sucção", "Mantém a bomba escorvada"]
          ],
          "id": "valvulas-w"
        },
        {
          "type": "table",
          "title": "Parafusos de flange ASME B16.5",
          "columns": ["Diâmetro (pol)", "DN", "Classe 150: qtd × Ø", "Classe 300: qtd × Ø"],
          "rows": [
            ["1/2\"", "15", "4 × 1/2\"", "4 × 1/2\""],
            ["3/4\"", "20", "4 × 1/2\"", "4 × 5/8\""],
            ["1\"", "25", "4 × 1/2\"", "4 × 5/8\""],
            ["1 1/2\"", "40", "4 × 1/2\"", "4 × 3/4\""],
            ["2\"", "50", "4 × 5/8\"", "8 × 5/8\""],
            ["3\"", "80", "4 × 5/8\"", "8 × 3/4\""],
            ["4\"", "100", "8 × 5/8\"", "8 × 3/4\""],
            ["6\"", "150", "8 × 3/4\"", "12 × 3/4\""],
            ["8\"", "200", "8 × 3/4\"", "12 × 7/8\""],
            ["10\"", "250", "12 × 7/8\"", "16 × 1\""],
            ["12\"", "300", "12 × 7/8\"", "16 × 1 1/8\""]
          ],
          "id": "valvulas-x"
        },
        {
          "type": "table",
          "title": "Problemas comuns",
          "columns": ["Problema", "Causa", "Ação"],
          "rows": [
            ["Vazamento pela haste", "Gaxeta gasta ou frouxa", "Reapertar a sobreposta por igual. Se não resolver, reengaxetar"],
            ["Passa com a válvula fechada", "Sede ou obturador danificado, sujeira", "Limpar, lapidar sede, trocar internos"],
            ["Válvula dura / emperrada", "Gaxeta apertada demais, haste corroída, rosca sem graxa", "Aliviar gaxeta, lubrificar, limpar haste"],
            ["Golpe de aríete na retenção", "Fechamento lento com fluxo reverso", "Retenção com mola ou dupla porta"],
            ["Vazamento na junta do corpo", "Junta danificada, aperto desigual", "Trocar junta, apertar em cruz"]
          ],
          "id": "valvulas-y"
        },
        {
          "type": "text",
          "title": "Como engaxetar",
          "text": "1. Remova toda a gaxeta velha e limpe a caixa e a haste.\n2. Meça: **seção da gaxeta = (Ø caixa − Ø haste) ÷ 2**.\n3. Corte os anéis enrolados em um mandril do diâmetro da haste, com **corte a 45°**.\n4. Monte anel por anel, **defasando as emendas 90° a 120°**, assentando cada um.\n5. Aperte a sobreposta por igual. Em **bombas**, deixe gotejar um pouco (refrigeração). Em **válvulas**, aperte até parar o vazamento.",
          "id": "valvulas-z"
        }
      ]
    },
    {
      "id": "redutores",
      "title": "Redutores",
      "icon": "🔩",
      "blocks": [
        {
          "type": "calc",
          "calc": "torque",
          "id": "redutores-10"
        },
        {
          "type": "table",
          "title": "Tipos de redutor",
          "columns": ["Tipo", "Redução / rendimento", "Características"],
          "rows": [
            ["Coroa e sem-fim", "5:1 a 100:1 por estágio / 50–90%", "Eixos a 90°, compacto, pode ser irreversível, aquece mais"],
            ["Engrenagens helicoidais", "até ~6:1 por estágio / ~97% por estágio", "Silencioso, alto rendimento, eixos paralelos"],
            ["Cônico-helicoidal", "Várias / ~95%", "Eixos a 90° com alto rendimento"],
            ["Planetário", "Altas / ~95–97%", "Compacto, alto torque, eixos coaxiais"],
            ["Cicloidal", "6:1 a 119:1 / ~90%", "Resiste bem a choques e sobrecargas"]
          ],
          "id": "redutores-11"
        },
        {
          "type": "table",
          "title": "Lubrificação (referência geral)",
          "columns": ["Item", "Referência"],
          "rows": [
            ["Óleo mais usado", "ISO VG 220 ou 320 com aditivo EP (mineral)"],
            ["Sem-fim", "Muitas vezes óleo sintético PAG. **PAG não mistura com mineral!**"],
            ["Primeira troca", "Após 300 a 500 h de operação (amaciamento)"],
            ["Trocas seguintes (mineral)", "A cada 2.500 a 5.000 h ou 1 ano"],
            ["Trocas seguintes (sintético)", "A cada 10.000 a 20.000 h"],
            ["Temperatura máx. do óleo", "Cerca de 80–90 °C (mineral)"],
            ["Nível", "Verificar com o redutor parado, pelo visor ou vareta"],
            ["Sempre", "Siga o manual e a plaqueta do fabricante"]
          ],
          "id": "redutores-12"
        },
        {
          "type": "table",
          "title": "Problemas comuns",
          "columns": ["Sintoma", "Causa provável", "Ação"],
          "rows": [
            ["Aquecimento", "Nível errado, óleo errado, sobrecarga, respiro entupido", "Nível, tipo de óleo, corrente do motor"],
            ["Ruído / batida", "Engrenagem ou rolamento gasto, folga, falta de óleo", "Análise de vibração, inspeção interna"],
            ["Vazamento de óleo", "Retentor gasto, respiro entupido, excesso de óleo", "Limpar respiro, trocar retentor, corrigir nível"],
            ["Folga no eixo de saída", "Rolamento gasto", "Trocar rolamentos e retentores"],
            ["Óleo leitoso", "Contaminação com água", "Trocar óleo, verificar respiro e vedações"],
            ["Limalha no óleo / bujão magnético", "Desgaste de engrenagem ou rolamento", "Análise do óleo, inspeção"]
          ],
          "id": "redutores-13"
        }
      ]
    },
    {
      "id": "parafusos",
      "title": "Parafusos e torque",
      "icon": "🔧",
      "blocks": [
        {
          "type": "table",
          "title": "Rosca métrica grossa: broca, chave e torque",
          "columns": ["Rosca", "Passo (mm)", "Broca p/ macho (mm)", "Chave (mm)", "Torque 8.8 (N·m)", "Torque 10.9 (N·m)"],
          "rows": [
            ["M5", "0,8", "4,2", "8", "6", "8,5"],
            ["M6", "1,0", "5,0", "10", "10", "14"],
            ["M8", "1,25", "6,8", "13", "25", "35"],
            ["M10", "1,5", "8,5", "16 (17)", "49", "69"],
            ["M12", "1,75", "10,2", "18 (19)", "85", "120"],
            ["M14", "2,0", "12,0", "21 (22)", "135", "190"],
            ["M16", "2,0", "14,0", "24", "210", "295"],
            ["M20", "2,5", "17,5", "30", "410", "580"],
            ["M24", "3,0", "21,0", "36", "710", "1000"],
            ["M30", "3,5", "26,5", "46", "1400", "2000"]
          ],
          "id": "parafusos-14"
        },
        {
          "type": "text",
          "title": "Observações",
          "text": "• Torques de referência para rosca seca ou levemente oleada (atrito µ ≈ 0,14). Com pasta antiengripante ou MoS₂, **reduza o torque** conforme o fabricante da pasta.\n• Classe **8.8**: resistência de 800 MPa, escoamento em 80% disso (640 MPa). Classe **10.9**: 1000 MPa, escoamento de 900 MPa.\n• Chave entre parênteses = norma DIN antiga.\n• Em flanges e tampas, aperte **em cruz**, em 3 etapas (30% → 70% → 100%).",
          "id": "parafusos-15"
        }
      ]
    },
    {
      "id": "conversoes",
      "title": "Conversões",
      "icon": "📐",
      "blocks": [
        {
          "type": "calc",
          "calc": "conversor",
          "id": "conversoes-16"
        },
        {
          "type": "table",
          "title": "Polegada fracionária → mm",
          "columns": ["Polegada", "mm"],
          "rows": [
            ["1/16\"", "1,588"],
            ["1/8\"", "3,175"],
            ["3/16\"", "4,763"],
            ["1/4\"", "6,350"],
            ["5/16\"", "7,938"],
            ["3/8\"", "9,525"],
            ["7/16\"", "11,113"],
            ["1/2\"", "12,700"],
            ["9/16\"", "14,288"],
            ["5/8\"", "15,875"],
            ["11/16\"", "17,463"],
            ["3/4\"", "19,050"],
            ["13/16\"", "20,638"],
            ["7/8\"", "22,225"],
            ["15/16\"", "23,813"],
            ["1\"", "25,400"],
            ["1 1/4\"", "31,750"],
            ["1 1/2\"", "38,100"],
            ["2\"", "50,800"]
          ],
          "id": "conversoes-17"
        }
      ]
    }
  ]
};
