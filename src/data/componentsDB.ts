import { ComponentData } from "../types";

export const componentsDB: ComponentData[] = [
  {
    id: "ckp-indutivo",
    name: "Sensor CKP (Rotação) - Indutivo",
    type: "sensor",
    shortDescription: "Mede a rotação do motor e Ponto Morto Superior (PMS).",
    fullDescription:
      "O sensor de rotação indutivo é um gerador de corrente alternada. Ele cria um campo magnético que é alterado pela passagem dos dentes da roda fônica. A lacuna de dentes indica para a ECU a posição exata do virabrequim (PMS). A amplitude do sinal aumenta conforme a aceleração da moto.",
    oscilloscopeSetup: {
      timeDiv: "10ms a 20ms",
      voltageDiv: "5V a 10V (pode gerar mais de 50V em alta rotação)",
      triggerEdge: "Subida ou Descida",
      triggerMode: "Normal",
      triggerLevel: "2V a 5V",
    },
    connectionInstructions:
      "Conecte a garra jacaré preta no negativo da bateria ou em um bom ponto de aterramento do motor. Com a ponta de prova (canal 1), espete o fio de sinal do sensor CKP. Geralmente o sensor possui dois fios (sinal e referência negativa), meça nos dois se não souber qual é o de sinal.",
    waveformExplanation:
      "O sinal do sensor indutivo reflete a imagem física da roda fônica. É uma Corrente Alternada (CA) cuja amplitude e frequência aumentam com o giro do motor. Anomalias como ondas tortas, picos menores isolados ou assimetria grave indicam roda fônica empenada, dentes quebrados ou excesso de limalha no sensor magnético.",
    waveformPhases: [
      {
        id: 1,
        title: "Aproximação do Dente (+)",
        description:
          "O dente se aproxima do núcleo magnético, concentrando as linhas de força e induzindo uma tensão positiva.",
        x: 20,
        y: 35,
        labelX: 20,
        labelY: 10,
      },
      {
        id: 2,
        title: "Alinhamento / Cruzamento Zero (0V)",
        description:
          "O centro do dente está perfeitamente alinhado com o sensor. O fluxo magnético é máximo, mas a variação é zero, logo a tensão é 0V.",
        x: 24,
        y: 50,
        labelX: 10,
        labelY: 50,
      },
      {
        id: 3,
        title: "Afastamento do Dente (-)",
        description:
          "O dente se afasta, o campo magnético colapsa e inverte a polaridade da tensão induzida (onda negativa).",
        x: 28,
        y: 65,
        labelX: 28,
        labelY: 90,
      },
      {
        id: 4,
        title: "Sincronismo / Falha (Gap)",
        description:
          "A ausência de dentes gera uma perturbação maior no campo magnético. Esta onda esticada e de maior amplitude informa a posição exata do eixo à ECU.",
        x: 59,
        y: 25,
        labelX: 59,
        labelY: 10,
      },
    ],
    waveType: "sine-gap",
  },
  {
    id: "ckp-hall",
    name: "Sensor CKP (Rotação) - Hall",
    type: "sensor",
    shortDescription: "Sensor digital de rotação e fase.",
    fullDescription:
      "O sensor de efeito Hall emite um sinal digital (onda quadrada) para a ECU. Ele precisa de alimentação (geralmente 5V ou 12V), um aterramento e emite o sinal. É muito comum em motos modernas (ex: Honda) para controle ultrapreciso.",
    oscilloscopeSetup: {
      timeDiv: "10ms a 20ms",
      voltageDiv: "2V",
      triggerEdge: "Subida",
      triggerMode: "Normal",
      triggerLevel: "2.5V",
    },
    connectionInstructions:
      "Aterre a garra preta do osciloscópio no negativo da bateria. Identifique os fios do sensor (Alimentação 5V/12V, Terra e Sinal). Espete a ponta de prova do canal 1 no fio de Sinal. Você pode confirmar a alimentação espetando no fio positivo (deve ser uma linha reta de 5V ou 12V).",
    waveformExplanation:
      "Diferente do indutivo, o sensor de Efeito Hall processa o sinal internamente e envia uma onda quadrada digital limpa para a ECU. A amplitude não muda com a rotação (sempre 5V ou 12V). Defeitos críticos a observar: base do sinal não chegando a 0V perfeito (falha de aterramento) ou bordas de subida/descida arredondadas (resistência/capacitância excessiva no chicote).",
    waveformPhases: [
      {
        id: 1,
        title: "Nível Lógico Baixo (0V)",
        description:
          'Sensor chaveando o circuito para o terra. Uma tensão de "zero" ruidosa ou acima de 0.2V indica mal contato de aterramento.',
        x: 15,
        y: 80,
        labelX: 15,
        labelY: 95,
      },
      {
        id: 2,
        title: "Borda de Subida/Descida",
        description:
          "Transição instantânea de estado. Um sensor saudável produzirá linhas verticais retas, sem inclinação.",
        x: 21,
        y: 50,
        labelX: 8,
        labelY: 50,
      },
      {
        id: 3,
        title: "Nível Lógico Alto (Vref)",
        description:
          "Tensão de referência proveniente do circuito pull-up da ECU (geralmente 5V ou 12V).",
        x: 25,
        y: 20,
        labelX: 25,
        labelY: 5,
      },
      {
        id: 4,
        title: "Gap de Sincronismo",
        description:
          "A falha da roda fônica cria uma janela prolongada de nível lógico (baixo ou alto, dependendo da engenharia da moto) para identificar o PMS.",
        x: 53,
        y: 80,
        labelX: 53,
        labelY: 95,
      },
    ],
    waveType: "square-gap",
  },
  {
    id: "injector",
    name: "Bico Injetor",
    type: "actuator",
    shortDescription: "Atuador eletromagnético que injeta combustível.",
    fullDescription:
      "O injetor é uma válvula solenoide. Ele recebe 12V constante (pós-chave ou relé) e a ECU controla o tempo de injeção aterrando o circuito (pulsando o negativo).",
    oscilloscopeSetup: {
      timeDiv: "1ms a 2ms",
      voltageDiv: "20V",
      triggerEdge: "Descida",
      triggerMode: "Normal",
      triggerLevel: "10V",
    },
    connectionInstructions:
      "Conecte a garra preta no negativo da bateria. No bico injetor há dois fios: um recebe alimentação constante (12V) e o outro é o pulso negativo controlado pela ECU. Espete a ponta de prova (canal 1) no fio de pulso negativo.",
    waveformExplanation:
      "O sinal do injetor é rico em detalhes eletromecânicos. O pulso de 0V dita o tempo que a válvula fica aberta. O pico indutivo demonstra a saúde elétrica da bobina interna. A corcova (Pintle Bump) na descida do sinal é a assinatura mecânica fundamental: ela comprova fisicamente que a agulha da válvula retornou à sede impulsionada pela mola.",
    waveformPhases: [
      {
        id: 1,
        title: "Repouso / Tensão de Alimentação",
        description:
          "Circuito aberto. A tensão de bateria (12V) aguarda no terminal do injetor.",
        x: 15,
        y: 70,
        labelX: 15,
        labelY: 50,
      },
      {
        id: 2,
        title: "Abertura (Tempo de Injeção)",
        description:
          "A ECU satura o transistor (aterra o circuito). A tensão cai para 0V, a corrente flui pela bobina do injetor e a válvula abre.",
        x: 42,
        y: 90,
        labelX: 42,
        labelY: 75,
      },
      {
        id: 3,
        title: "Pico Indutivo (Flyback)",
        description:
          "A ECU corta o terra abruptamente. O colapso magnético na bobina induz um pico de tensão severo (geralmente ceifado internamente na ECU entre 60V e 100V).",
        x: 55.5,
        y: 15,
        labelX: 45,
        labelY: 15,
      },
      {
        id: 4,
        title: "Fechamento Mecânico (Pintle Bump)",
        description:
          "A agulha choca-se contra a sede fechando a válvula. O impacto e movimento mecânico dentro do campo magnético residual criam esta corcova no traçado elétrico.",
        x: 58.5,
        y: 48,
        labelX: 70,
        labelY: 25,
      },
      {
        id: 5,
        title: "Estabilização",
        description:
          "A energia é dissipada e o injetor retorna ao estado inativo de 12V.",
        x: 85,
        y: 70,
        labelX: 85,
        labelY: 50,
      },
    ],
    waveType: "injector",
  },
  {
    id: "ignition-coil",
    name: "Bobina de Ignição (Primário)",
    type: "actuator",
    shortDescription: "Eleva a tensão para gerar a centelha na vela.",
    fullDescription:
      "A bobina é um transformador. Medimos o circuito primário. Assim como o injetor, a ECU (ou módulo de ignição) aterra o primário para carregar a bobina (tempo de Dwell) e corta para gerar a alta tensão que será induzida para o secundário (vela).",
    oscilloscopeSetup: {
      timeDiv: "1ms",
      voltageDiv: "50V a 100V",
      triggerEdge: "Descida",
      triggerMode: "Normal",
      triggerLevel: "10V",
    },
    connectionInstructions:
      "Use um atenuador 20:1 ou a pinça capacitiva para evitar queimar seu osciloscópio, pois o pico indutivo pode passar de 400V. Conecte a garra preta no negativo. Espete a ponta de prova (com atenuador) no fio de controle (pulso negativo da ECU) no conector primário da bobina.",
    waveformExplanation:
      "A análise do primário da bobina de ignição é a janela principal para a saúde de todo o sistema de ignição (velas, cabos, misturas). O tempo de queima e a tensão sustentada durante a faísca indicam o quão limpa foi a combustão. Falta de oscilações residuais denotam curto-circuito interno na bobina.",
    waveformPhases: [
      {
        id: 1,
        title: "Carregamento (Dwell)",
        description:
          "A ECU aterra o circuito primário, a tensão cai para 0V e a corrente magnética começa a saturar a bobina.",
        x: 30,
        y: 80,
        labelX: 30,
        labelY: 95,
      },
      {
        id: 2,
        title: "Tensão de Disparo (Spike)",
        description:
          "A ECU desfaz o aterramento. O colapso magnético instantâneo gera o pico que induzirá milhares de Volts no secundário para o salto da centelha.",
        x: 46,
        y: -5,
        labelX: 58,
        labelY: -5,
      },
      {
        id: 3,
        title: "Linha de Queima (Spark Line)",
        description:
          "A centelha está acesa. A altura desta linha representa a resistência do cilindro (mistura ar/combustível e compressão) e o comprimento é o Tempo de Queima (geralmente de 1 a 2ms).",
        x: 53,
        y: 49,
        labelX: 45,
        labelY: 65,
      },
      {
        id: 4,
        title: "Pendente (Extinção)",
        description:
          "A energia remanescente na bobina já não é suficiente para manter o plasma da faísca. O fluxo elétrico é cortado causando um pequeno salto.",
        x: 59,
        y: 40,
        labelX: 60,
        labelY: 20,
      },
      {
        id: 5,
        title: "Oscilações Residuais",
        description:
          "O excedente de energia na bobina se dissipa balançando no circuito LC. Uma bobina saudável apresentará de 3 a 5 oscilações claras antes de voltar aos 12V.",
        x: 65,
        y: 35,
        labelX: 80,
        labelY: 15,
      },
    ],
    waveType: "ignition",
  },
  {
    id: "tps",
    name: "Sensor TPS (Borboleta)",
    type: "sensor",
    shortDescription: "Mede a abertura do acelerador.",
    fullDescription:
      "O TPS é um potenciômetro alimentado com 5V pela ECU. Ele varia a resistência conforme você acelera a moto, enviando um sinal de tensão de retorno (geralmente de 0.4V a 4.5V) para a ECU saber a demanda de carga do piloto.",
    oscilloscopeSetup: {
      timeDiv: "200ms a 500ms",
      voltageDiv: "1V",
      triggerEdge: "Subida",
      triggerMode: "Auto",
      triggerLevel: "1V",
    },
    connectionInstructions:
      "Aterre a garra preta no negativo da bateria. O TPS possui três fios (5V, Terra e Sinal). Com a ignição ligada (motor desligado), espete a ponta de prova no fio de sinal. Gire o acelerador lentamente e observe a rampa de tensão subindo no osciloscópio.",
    waveformExplanation:
      'Ao acelerar devagar, o sinal deve subir formando uma rampa contínua e lisa, saindo de ~0.5V e indo até ~4.5V. Quedas abruptas a zero no meio da rampa indicam trilha do sensor rompida ou gasta (causa "buracos" na aceleração).',
    waveformPhases: [
      {
        id: 1,
        title: "Marcha Lenta",
        description: "Borboleta fechada, tensão baixa (~0.5V).",
        x: 10,
        y: 85,
        labelX: 10,
        labelY: 70,
      },
      {
        id: 2,
        title: "Aceleração",
        description: "Rampa de subida contínua sem interrupções.",
        x: 50,
        y: 50,
        labelX: 40,
        labelY: 35,
      },
      {
        id: 3,
        title: "Carga Máxima (WOT)",
        description: "Borboleta totalmente aberta, tensão alta (~4.5V).",
        x: 90,
        y: 15,
        labelX: 90,
        labelY: 30,
      },
    ],
    waveType: "tps",
  },
  {
    id: "lambda",
    name: "Sonda Lambda (Oxigênio)",
    type: "sensor",
    shortDescription: "Mede a mistura Ar/Combustível no escape.",
    fullDescription:
      "A sonda lambda de Zircônia mede o oxigênio restante nos gases de escape. Ela gera sua própria voltagem (de 0.1V a 0.9V) em reação ao oxigênio. Mistura pobre = baixa tensão (~0.1V), Mistura rica = alta tensão (~0.9V).",
    oscilloscopeSetup: {
      timeDiv: "200ms a 500ms",
      voltageDiv: "200mV (0.2V)",
      triggerEdge: "Subida",
      triggerMode: "Auto",
      triggerLevel: "400mV",
    },
    connectionInstructions:
      "Conecte a garra preta no negativo da bateria (ou no fio terra do sensor, se preferir isolar o chicote). Identifique o fio de Sinal da sonda lambda (normalmente o fio preto, em sondas de 4 fios, ou o único fio solto nas antigas). Espete a ponta de prova com o motor quente e funcionando.",
    waveformExplanation:
      "Com a moto quente e em marcha lenta/aceleração constante, a onda deve ciclar de forma suave e rápida entre 100mV (0.1V) e 800mV-900mV (0.9V). Ondas muito lentas ou travadas indicam sonda contaminada ou defeituosa.",
    waveformPhases: [
      {
        id: 1,
        title: "Mistura Rica",
        description: "Baixo oxigênio no escape, tensão alta (~800mV).",
        x: 15,
        y: 20,
        labelX: 15,
        labelY: 35,
      },
      {
        id: 2,
        title: "Transição",
        description: "A sonda ciclando e cruzando o eixo médio (~450mV).",
        x: 30,
        y: 50,
        labelX: 40,
        labelY: 50,
      },
      {
        id: 3,
        title: "Mistura Pobre",
        description: "Alto oxigênio no escape, tensão baixa (~100mV).",
        x: 45,
        y: 80,
        labelX: 45,
        labelY: 65,
      },
    ],
    waveType: "lambda",
  },
  {
    id: "map",
    name: "Sensor MAP",
    type: "sensor",
    shortDescription: "Sensor de Pressão Absoluta do Coletor.",
    fullDescription:
      "O sensor MAP mede o vácuo dentro do coletor de admissão. Alimentado com 5V, sua tensão de resposta varia conforme a borboleta abre ou fecha e os pistões sugam o ar.",
    oscilloscopeSetup: {
      timeDiv: "50ms a 100ms",
      voltageDiv: "1V",
      triggerEdge: "Subida",
      triggerMode: "Auto",
      triggerLevel: "2.5V",
    },
    connectionInstructions:
      "Aterre a garra preta no negativo da bateria. O MAP possui três fios (Alimentação 5V, Terra e Sinal). Espete a ponta de prova no fio de Sinal. Ligue a moto e observe a variação de tensão ao acelerar subitamente o motor.",
    waveformExplanation:
      "Em marcha lenta, o sinal fica baixo (alto vácuo, ex: 1.5V). Ao dar uma aceleração rápida (Snap Throttle), a pressão sobe (vácuo cai), e o sinal dá um pico até próximo de 4V. Também é possível ver oscilações correspondentes à sucção dos cilindros em marcha lenta.",
    waveformPhases: [
      {
        id: 1,
        title: "Marcha Lenta",
        description: "Alto vácuo no coletor, tensão baixa.",
        x: 10,
        y: 70,
        labelX: 10,
        labelY: 55,
      },
      {
        id: 2,
        title: "Aceleração Rápida",
        description:
          "Vácuo cai (pressão sobe) subitamente, gerando um pico de tensão.",
        x: 25,
        y: 55,
        labelX: 25,
        labelY: 40,
      },
      {
        id: 3,
        title: "WOT (Borboleta Aberta)",
        description: "Pressão quase igual à atmosférica, tensão máxima.",
        x: 40,
        y: 40,
        labelX: 40,
        labelY: 25,
      },
      {
        id: 4,
        title: "Desaceleração",
        description:
          "Borboleta fecha em alto giro, vácuo atinge seu máximo (tensão cai ao mínimo).",
        x: 70,
        y: 80,
        labelX: 70,
        labelY: 95,
      },
    ],
    waveType: "map",
  },
];
