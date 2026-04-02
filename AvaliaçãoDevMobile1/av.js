import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  FlatList,
  Modal,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';

const YOUR_NAME = 'Igor Costa Gerlach';

const HELP = {
  0: {
    title: '1. Contador de Ovelhinhas',
    requested:
      'Criar uma tela com um número centralizado, botão "+" e botão "−". O número deve aumentar e diminuir conforme o valor de variação informado pelo usuário.',
    added:
      'Transformei em contador de ovelhinhas, com cercado visual, botão de zerar e prévia rolável para a interface não quebrar.',
  },
  1: {
    title: '2. Luz com Combo',
    requested:
      'Criar um botão que alterna entre "Ligado" e "Desligado", mudando a cor do fundo e de um círculo na tela.',
    added:
      'Adicionei sistema de combo, reset automático por tempo, crescimento visual do combo e lâmpada queimada ao chegar em 10x.',
  },
  2: {
    title: '3. Formulário de Nome',
    requested:
      'Criar um TextInput para o nome e um botão "Saudar", exibindo "Olá, [nome]!" ou uma mensagem de aviso se o campo estiver vazio.',
    added:
      'Adicionei saudações especiais para Anderson e Igor, mais uma dica fixa na tela para testar nomes diferentes.',
  },
  3: {
    title: '4. Mini Organizador',
    requested:
      'Criar TextInput + botão "Adicionar" e exibir os itens em uma lista.',
    added:
      'Transformei em mini organizador com tags, filtros por abas e contagem por categoria.',
  },
  4: {
    title: '5. Bomba Regressiva',
    requested:
      'Criar um cronômetro regressivo começando em 10 segundos usando useEffect/setInterval. Ao chegar em 0, deve parar e mostrar "Tempo esgotado!".',
    added:
      'Transformei em bomba com relógio central, cor de urgência, botão de iniciar, reiniciar e código de 10 dígitos para desarmar.',
  },
  5: {
    title: '6. Busca de Piada',
    requested:
      'Buscar uma piada aleatória na API official-joke-api ao abrir a tela, permitir buscar outra e fazer a tradução.',
    added:
      'Adicionei tradução do setup e punchline, avaliação de 0 a 5, reação visual e indicação do tipo general/programming.',
  },
  6: {
    title: '7. Mini Clima',
    requested:
      'Criar TextInput para cidade, botão "Buscar", espera simulada de 1 segundo, indicador de carregamento e clima aleatório com temperatura.',
    added:
      'Adicionei fundo temático por clima, emoji, imagem e cartão visual com a condição sorteada.',
  },
  7: {
    title: '8. Lista com Remoção',
    requested:
      'Evoluir a lista mínima adicionando um botão "✕" em cada item para removê-lo da lista.',
    added:
      'Adicionei lixeira fixa na tela, contador de itens removidos e feedback visual do último item enviado.',
  },
};

const TABS = [
  { id: 0, label: 'Contador', icon: '🐑' },
  { id: 1, label: 'Luz', icon: '💡' },
  { id: 2, label: 'Nome', icon: '👋' },
  { id: 3, label: 'Tarefa v1', icon: '📝' },
  { id: 4, label: 'Cronômetro', icon: '⏱️' },
  { id: 5, label: 'Piada', icon: '😂' },
  { id: 6, label: 'Clima', icon: '🌦️' },
  { id: 7, label: 'Tarefa v2', icon: '🗂️' },
];

const TAGS = ['Escola', 'Casa', 'Trabalho', 'Pessoal', 'Outros'];

const WEATHER_THEMES = {
  Ensolarado: {
    bg: '#FFF6D8',
    card: '#FFFDF5',
    accent: '#D48A00',
    text: '#5E3B00',
    emoji: '☀️',
    image: 'https://openweathermap.org/img/wn/01d@4x.png',
  },
  Nublado: {
    bg: '#E8EEF5',
    card: '#F8FBFF',
    accent: '#64748B',
    text: '#243B53',
    emoji: '☁️',
    image: 'https://openweathermap.org/img/wn/03d@4x.png',
  },
  Chuvoso: {
    bg: '#1F3142',
    card: '#2A3E52',
    accent: '#4FC3F7',
    text: '#FFFFFF',
    emoji: '🌧️',
    image: 'https://openweathermap.org/img/wn/09d@4x.png',
  },
};

// ======== COMPONENTES COMPARTILHADOS ========
function AppButton({
  label,
  onPress,
  color = '#1565C0',
  textColor = '#FFFFFF',
  style,
  disabled = false,
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: disabled ? '#A0AEC0' : color,
          opacity: pressed ? 0.88 : 1,
        },
        style,
      ]}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

function HelpModal({ visible, onClose, info }) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{info.title}</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.modalBox}>
              <Text style={styles.modalBoxTitle}>Pedido original</Text>
              <Text style={styles.modalText}>{info.requested}</Text>
            </View>

            <View style={styles.modalBox}>
              <Text style={styles.modalBoxTitle}>O que foi adicionado</Text>
              <Text style={styles.modalText}>{info.added}</Text>
            </View>
          </ScrollView>

          <AppButton label="Fechar" onPress={onClose} color="#17324D" />
        </View>
      </View>
    </Modal>
  );
}

function ScreenFrame({
  tabIndex,
  title,
  children,
  footer,
  backgroundColor = '#F3F7FB',
  dark = false,
}) {
  const [open, setOpen] = useState(false);
  const headerTextColor = dark ? '#FFFFFF' : '#102A43';
  const secondaryColor = dark ? '#D9E2EC' : '#486581';
  const borderColor = dark ? 'rgba(255,255,255,0.18)' : '#D8E1EB';

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor }]}>
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <View style={styles.headerTextArea}>
          <Text style={[styles.headerTitle, { color: headerTextColor }]}>
            {title}
          </Text>
          <Text style={[styles.headerSubtitle, { color: secondaryColor }]}>
            {YOUR_NAME}
          </Text>
        </View>

        <Pressable
          onPress={() => setOpen(true)}
          style={[
            styles.helpButton,
            { backgroundColor: dark ? '#FFFFFF' : '#17324D' },
          ]}
        >
          <Text
            style={[
              styles.helpButtonText,
              { color: dark ? '#17324D' : '#FFFFFF' },
            ]}
          >
            ?
          </Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {children}
      </View>

      {footer ? (
        <View
          style={[
            styles.footer,
            {
              borderTopColor: borderColor,
              backgroundColor: dark ? 'rgba(0,0,0,0.08)' : '#FFFFFF',
            },
          ]}
        >
          {footer}
        </View>
      ) : null}

      <HelpModal visible={open} onClose={() => setOpen(false)} info={HELP[tabIndex]} />
    </SafeAreaView>
  );
}

// ======== ATV 1: CONTADOR SIMPLES ========
function CounterScreen() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState('1');

  const safeStep = Math.max(1, parseInt(step, 10) || 1);
  const sheepPreview = Math.min(count, 60);

  return (
    <ScreenFrame
      tabIndex={0}
      title="1. Contador de Ovelhinhas"
      footer={
        <View style={styles.footerRow}>
          <AppButton
            label="−"
            color="#D64545"
            style={styles.footerButton}
            onPress={() => setCount((prev) => Math.max(0, prev - safeStep))}
          />
          <AppButton
            label="Zerar"
            color="#6B7280"
            style={styles.footerButton}
            onPress={() => setCount(0)}
          />
          <AppButton
            label="+"
            color="#2E7D32"
            style={styles.footerButton}
            onPress={() => setCount((prev) => prev + safeStep)}
          />
        </View>
      }
    >
      <View style={styles.bigCard}>
        <Text style={styles.cardLabel}>Quantidade atual</Text>
        <Text style={styles.bigNumber}>{count}</Text>
        <Text style={styles.cardHint}>Variação: {safeStep}</Text>
      </View>

      <View style={[styles.card, { marginTop: 12 }]}>
        <Text style={styles.cardTitle}>Valor de variação</Text>
        <TextInput
          style={styles.input}
          value={step}
          onChangeText={setStep}
          keyboardType="number-pad"
          placeholder="Digite a variação"
        />
      </View>

      <View style={[styles.card, styles.flexCard, { marginTop: 12 }]}>
        <Text style={styles.cardTitle}>Cercado de ovelhas</Text>
        <View style={styles.sheepBox}>
          <ScrollView contentContainerStyle={styles.sheepContent}>
            {count === 0 ? (
              <Text style={styles.emptyText}>O cercado está vazio.</Text>
            ) : (
              Array.from({ length: sheepPreview }).map((_, index) => (
                <Text key={index} style={styles.sheep}>
                  🐑
                </Text>
              ))
            )}
            {count > 60 ? (
              <Text style={styles.extraText}>+ {count - 60} ovelhas fora da prévia</Text>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </ScreenFrame>
  );
}

// ======== ATV 2: LUZ ACENDE / APAGA ========
function LightScreen() {
  const [isOn, setIsOn] = useState(false);
  const [combo, setCombo] = useState(0);
  const [burned, setBurned] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const resetComboTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCombo(0), 2500);
  };

  const toggleLight = () => {
    if (burned) return;

    const next = !isOn;
    setIsOn(next);

    if (next) {
      setCombo((prev) => {
        const value = prev + 1;
        if (value >= 10) {
          setBurned(true);
          setIsOn(false);
          clearTimeout(timerRef.current);
          return 10;
        }
        return value;
      });
      resetComboTimer();
    }
  };

  const resetAll = () => {
    clearTimeout(timerRef.current);
    setIsOn(false);
    setCombo(0);
    setBurned(false);
  };

  const bg = burned ? '#2A1B22' : isOn ? '#FFF4C2' : '#112433';
  const dark = burned || !isOn;
  const comboSize = Math.min(16 + combo * 0.7, 38);

  return (
    <ScreenFrame
      tabIndex={1}
      title="2. Luz com Combo"
      backgroundColor={bg}
      dark={dark}
      footer={
        <View style={styles.footerRow}>
          <AppButton
            label={burned ? 'Queimada' : isOn ? 'Desligar' : 'Ligar'}
            color={burned ? '#6B7280' : isOn ? '#EF6C00' : '#1565C0'}
            style={styles.doubleFooterButton}
            onPress={toggleLight}
            disabled={burned}
          />
          <AppButton
            label="Resetar"
            color="#455A64"
            style={styles.doubleFooterButton}
            onPress={resetAll}
          />
        </View>
      }
    >
      <View style={[styles.card, { alignItems: 'center' }]}>
        <View
          style={[
            styles.lightCircle,
            {
              backgroundColor: burned ? '#7A7A7A' : isOn ? '#FFD233' : '#4A6072',
            },
          ]}
        />
        <Text style={styles.statusBig}>
          {burned ? '💥 Lâmpada queimada' : isOn ? 'Ligada' : 'Desligada'}
        </Text>
      </View>

      <View style={[styles.card, { marginTop: 12 }]}>
        <Text style={styles.cardTitle}>Combo</Text>
        <Text style={[styles.comboText, { fontSize: comboSize }]}>🔥 {combo}x</Text>
        <Text style={styles.cardHint}>
          Se ficar 2,5 segundos sem acender, o combo zera. Em 10x a luz queima.
        </Text>
      </View>
    </ScreenFrame>
  );
}

// ======== ATV 3: FORMULÁRIO DE NOME ========
function NameScreen() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('Digite um nome e toque em "Saudar".');

  const greet = () => {
    const clean = name.trim();

    if (!clean) {
      setMessage('⚠️ Digite um nome para continuar.');
      return;
    }

    const lower = clean.toLowerCase();

    if (lower === 'anderson') {
      setMessage(`Olá, professor ${clean}! 👨‍🏫`);
      return;
    }

    if (lower === 'igor') {
      setMessage(`Olá, desenvolvedor ${clean}! 💻`);
      return;
    }

    setMessage(`Olá, ${clean}! 👋`);
  };

  return (
    <ScreenFrame
      tabIndex={2}
      title="3. Formulário de Nome"
      footer={<AppButton label="Saudar" onPress={greet} color="#1565C0" />}
    >
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Seu nome</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Digite seu nome"
        />
        <Text style={styles.cardHint}>Dica: teste Anderson e Igor.</Text>
      </View>

      <View style={[styles.card, { marginTop: 12, minHeight: 150, justifyContent: 'center' }]}>
        <Text style={styles.cardTitle}>Saudação</Text>
        <Text style={styles.messageText}>{message}</Text>
      </View>
    </ScreenFrame>
  );
}

// ======== ATV 4: LISTA DE TAREFAS MÍNIMA ========
function TasksTagsScreen() {
  const [text, setText] = useState('');
  const [tag, setTag] = useState('Pessoal');
  const [filter, setFilter] = useState('Tudo');
  const [tasks, setTasks] = useState([]);

  const filters = ['Tudo', ...TAGS];

  const addTask = () => {
    const clean = text.trim();
    if (!clean) return;

    setTasks((prev) => [
      ...prev,
      {
        id: String(Date.now() + Math.random()),
        text: clean,
        tag,
      },
    ]);
    setText('');
  };

  const visibleTasks =
    filter === 'Tudo' ? tasks : tasks.filter((item) => item.tag === filter);

  const countByTag = (currentTag) =>
    tasks.filter((item) => item.tag === currentTag).length;

  return (
    <ScreenFrame tabIndex={3} title="4. Mini Organizador">
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Nova tarefa</Text>
        <View style={styles.inlineRow}>
          <TextInput
            style={[styles.input, styles.inlineInput]}
            value={text}
            onChangeText={setText}
            placeholder="Ex.: Estudar React Native"
          />
          <AppButton
            label="Adicionar"
            onPress={addTask}
            color="#7B1FA2"
            style={styles.inlineAction}
          />
        </View>
      </View>

      <View style={[styles.card, { marginTop: 12 }]}>
        <Text style={styles.cardTitle}>Escolha a tag</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipsRow}>
            {TAGS.map((item) => (
              <Pressable
                key={item}
                onPress={() => setTag(item)}
                style={[styles.chip, tag === item && styles.chipActive]}
              >
                <Text style={[styles.chipText, tag === item && styles.chipTextActive]}>
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={[styles.card, { marginTop: 12 }]}>
        <Text style={styles.cardTitle}>Filtros</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipsRow}>
            {filters.map((item) => {
              const amount = item === 'Tudo' ? tasks.length : countByTag(item);
              return (
                <Pressable
                  key={item}
                  onPress={() => setFilter(item)}
                  style={[styles.chip, filter === item && styles.filterChipActive]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      filter === item && styles.chipTextActive,
                    ]}
                  >
                    {item} ({amount})
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <View style={[styles.card, styles.flexCard, { marginTop: 12 }]}>
        <Text style={styles.cardTitle}>Lista</Text>
        <FlatList
          data={visibleTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskText}>{item.text}</Text>
              <View style={styles.tagBadge}>
                <Text style={styles.tagBadgeText}>{item.tag}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Nenhuma tarefa encontrada</Text>
              <Text style={styles.emptyText}>
                Adicione uma tarefa ou troque o filtro.
              </Text>
            </View>
          }
        />
      </View>
    </ScreenFrame>
  );
}

// ======== ATV 5: CRONÔMETRO REGRESSIVO ========
function BombScreen() {
  const CODE_SIZE = 10;
  const generateCode = () =>
    Array.from({ length: CODE_SIZE }, () => Math.floor(Math.random() * 10)).join(
      ''
    );

  const [time, setTime] = useState(10);
  const [running, setRunning] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [disarmed, setDisarmed] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [correctCode, setCorrectCode] = useState('');

  useEffect(() => {
    if (!running || exploded || disarmed) return;

    const id = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setRunning(false);
          setExploded(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [running, exploded, disarmed]);
  
  const startRunning = () => {
    if (!correctCode) {
      setCorrectCode(generateCode());
    }
    setRunning(true);
  };

  const restart = () => {
    setTime(10);
    setRunning(false);
    setExploded(false);
    setDisarmed(false);
    setInputCode('');
    setCorrectCode('');
  };

  const inputLocked = exploded || disarmed;

  const addDigit = (digit) => {
    if (inputLocked) return;

    setInputCode((prev) => {
      if (prev.length >= CODE_SIZE) return prev;
      return `${prev}${digit}`;
    });
  };

  const removeDigit = () => {
    if (inputLocked) return;
    setInputCode((prev) => prev.slice(0, -1));
  };

  const clearDigits = () => {
    if (inputLocked) return;
    setInputCode('');
  };

  const tryDisarm = () => {
    if (inputLocked) return;
    
    if (inputCode.length !== CODE_SIZE) {
      Alert.alert('Código incompleto', `Digite exatamente ${CODE_SIZE} números.`);
      return;
    }

    if (inputCode === correctCode) {
      setDisarmed(true);
      setRunning(false);
    } else {
      Alert.alert('Código errado', 'A bomba continua armada.');
    }
  };

  const bg = exploded ? '#5A1B1B' : disarmed ? '#153B26' : '#FFF3F1';
  const dark = exploded || disarmed;
  const timerColor = time > 6 ? '#243B53' : time > 3 ? '#EF6C00' : '#C62828';
  const typedDigits = Array.from({ length: CODE_SIZE }, (_, index) => {
    return inputCode[index] || '•';
  });
  const keypadDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <ScreenFrame
      tabIndex={4}
      title="5. Bomba Regressiva"
      backgroundColor={bg}
      dark={dark}
      footer={
        <View style={styles.footerRow}>
          <AppButton
            label={running ? 'Rodando' : 'Iniciar'}
            onPress={startRunning}
            color="#2E7D32"
            style={styles.footerButton}
            disabled={running || exploded || disarmed}
          />
          <AppButton
            label="Reiniciar"
            onPress={restart}
            color="#EF6C00"
            style={styles.footerButton}
          />
          <AppButton
            label="Desarmar"
            onPress={tryDisarm}
            color="#7B1FA2"
            style={styles.footerButton}
            disabled={exploded || disarmed}
          />
        </View>
      }
    >
      <View style={[styles.card, { alignItems: 'center' }]}>
        <View style={[styles.bombClock, { borderColor: timerColor }]}>
          <Text style={[styles.bombClockText, { color: timerColor }]}>
            {exploded ? '💥' : disarmed ? '✅' : time}
          </Text>
        </View>

        <Text style={styles.statusBig}>
          {exploded
            ? 'Tempo esgotado!'
            : disarmed
            ? 'Bomba desarmada!'
            : running
            ? 'Contagem em andamento...'
            : 'Pronta para iniciar'}
        </Text>
      </View>

      <View style={[styles.card, { marginTop: 8 }]}>
        <Text style={styles.cardTitle}>Código de 10 dígitos</Text>
        <Text style={styles.cardHint}>Código alvo: {correctCode || '*** Clique em iniciar ***'}</Text>

        <View style={styles.codeSlotsGrid}>
          {typedDigits.map((digit, index) => {
            const filled = digit !== '•';

            return (
              <View key={index} style={[styles.codeSlot, filled && styles.codeSlotFilled]}>
                <Text
                  style={[styles.codeSlotText, filled && styles.codeSlotTextFilled]}
                >
                  {digit}
                </Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.cardHint}>
          {inputCode.length}/{CODE_SIZE} dígitos preenchidos
        </Text>

        <View style={styles.keypadGrid}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => {
            const digitDisabled = inputLocked || inputCode.length >= CODE_SIZE;

            return (
              <Pressable
                key={digit}
                onPress={() => addDigit(digit)}
                disabled={digitDisabled}
                style={({ pressed }) => [
                  styles.keypadKey,
                  digitDisabled && styles.keypadKeyDisabled,
                  pressed && !digitDisabled && styles.keypadKeyPressed,
                ]}
              >
                <Text style={styles.keypadKeyText}>{digit}</Text>
              </Pressable>
            );
          })}
          <AppButton
            label="Apag."
            onPress={removeDigit}
            color="#546E7A"
            style={styles.keypadKeyButton}
            disabled={inputLocked || inputCode.length === 0}
          />
          <Pressable
            onPress={() => addDigit(0)}
            disabled={inputLocked || inputCode.length >= CODE_SIZE}
            style={({ pressed }) => [
              styles.keypadKey,
              (inputLocked || inputCode.length >= CODE_SIZE) && styles.keypadKeyDisabled,
              pressed && !(inputLocked || inputCode.length >= CODE_SIZE) && styles.keypadKeyPressed,
            ]}
          >
            <Text style={styles.keypadKeyText}>0</Text>
          </Pressable>
          <AppButton
            label="Limp."
            onPress={clearDigits}
            color="#8E24AA"
            style={styles.keypadKeyButton}
            disabled={inputLocked || inputCode.length === 0}
          />
        </View>
      </View>
    </ScreenFrame>
  );
}

// ======== ATV 6: BUSCA DE PIADA ALEATÓRIA ========
function JokeScreen() {
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(null);

  const translateText = async (text) => {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=en|pt-br`;

    const res = await fetch(url);
    const data = await res.json();
    return data?.responseData?.translatedText || text;
  };

  const loadJoke = async () => {
    setLoading(true);
    setRating(null);

    try {
      const res = await fetch('https://official-joke-api.appspot.com/random_joke');
      const data = await res.json();

      const [setupPt, punchlinePt] = await Promise.all([
        translateText(data.setup),
        translateText(data.punchline),
      ]);

      setJoke({
        type: data.type,
        setup: setupPt,
        punchline: punchlinePt,
      });
    } catch (error) {
      setJoke({
        type: 'general',
        setup: 'Erro ao buscar a piada.',
        punchline: 'Toque em "Nova piada" para tentar novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJoke();
  }, []);

  const reaction =
    rating === null
      ? 'Dê uma nota de 0 a 5.'
      : rating === 5
      ? '😂🤣 Essa foi ótima!'
      : rating >= 2
      ? '😐 Foi aceitável.'
      : '😡😢 Essa foi ruim.';

  const stars =
    rating === null ? '☆☆☆☆☆' : '★'.repeat(rating) + '☆'.repeat(5 - rating);

  const typeEmoji = joke?.type === 'programming' ? '👨‍💻' : '🙂';

  return (
    <ScreenFrame
      tabIndex={5}
      title="6. Busca de Piada"
      footer={<AppButton label="Nova piada" onPress={loadJoke} color="#EF6C00" />}
    >
      <View style={[styles.card, styles.flexCard]}>
        {loading ? (
          <View style={styles.centerArea}>
            <ActivityIndicator size="large" color="#1565C0" />
            <Text style={styles.cardHint}>Buscando e traduzindo...</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.typeEmoji}>{typeEmoji}</Text>
            <Text style={styles.typeText}>
              Tipo: {joke?.type === 'programming' ? 'programming' : 'general'}
            </Text>

            <Text style={styles.jokeSetup}>{joke?.setup}</Text>
            <Text style={styles.jokePunch}>{joke?.punchline}</Text>

            <Text style={styles.cardTitle}>Avaliação</Text>
            <View style={styles.ratingRow}>
              {[0, 1, 2, 3, 4, 5].map((value) => (
                <Pressable
                  key={value}
                  onPress={() => setRating(value)}
                  style={[
                    styles.ratingButton,
                    rating === value && styles.ratingButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.ratingButtonText,
                      rating === value && styles.ratingButtonTextActive,
                    ]}
                  >
                    {value}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.starText}>{stars}</Text>
            <Text style={styles.reactionText}>{reaction}</Text>
          </ScrollView>
        )}
      </View>
    </ScreenFrame>
  );
}

// ======== ATV 7: MINI APP DE CLIMA SIMULADO ========
function WeatherScreen() {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);

  const conditions = ['Ensolarado', 'Nublado', 'Chuvoso'];
  const theme = weather ? WEATHER_THEMES[weather.condition] : null;

  const searchWeather = () => {
    const clean = city.trim();
    if (!clean) return;

    setLoading(true);
    setWeather(null);

    setTimeout(() => {
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      const temperature = Math.floor(Math.random() * 30) + 5;

      setWeather({
        city: clean,
        condition,
        temperature,
      });
      setLoading(false);
    }, 1000);
  };

  const bg = theme ? theme.bg : '#EEF3F7';
  const dark = theme?.condition === 'Chuvoso';

  return (
    <ScreenFrame
      tabIndex={6}
      title="7. Mini Clima"
      backgroundColor={bg}
      dark={dark}
      footer={<AppButton label="Buscar" onPress={searchWeather} color="#1565C0" />}
    >
      <View style={[styles.card, theme ? { backgroundColor: theme.card } : null]}>
        <Text style={styles.cardTitle}>Cidade</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="Digite uma cidade"
        />
      </View>

      <View
        style={[
          styles.card,
          styles.flexCard,
          { marginTop: 12, alignItems: 'center', justifyContent: 'center' },
          theme ? { backgroundColor: theme.card } : null,
        ]}
      >
        {loading ? (
          <>
            <ActivityIndicator size="large" color="#1565C0" />
            <Text style={styles.cardHint}>Carregando clima simulado...</Text>
          </>
        ) : weather ? (
          <>
            <Image
              source={{ uri: theme.image }}
              style={styles.weatherImage}
              resizeMode="contain"
            />
            <Text style={[styles.weatherEmoji, { color: theme.accent }]}>
              {theme.emoji}
            </Text>
            <Text style={[styles.weatherTemp, { color: theme.text }]}>
              {weather.temperature}°C
            </Text>
            <Text style={[styles.weatherCondition, { color: theme.text }]}>
              {weather.condition}
            </Text>
            <Text style={[styles.weatherCity, { color: theme.text }]}>
              {weather.city}
            </Text>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nenhuma busca ainda</Text>
            <Text style={styles.emptyText}>
              Digite uma cidade e toque em "Buscar".
            </Text>
          </View>
        )}
      </View>
    </ScreenFrame>
  );
}

// ======== ATV 8: LISTA DE TAREFAS COM REMOÇÃO ========
function RemoveTasksScreen() {
  const [text, setText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [trashCount, setTrashCount] = useState(0);
  const [lastRemoved, setLastRemoved] = useState('');
  const [trashActive, setTrashActive] = useState(false);

  const addTask = () => {
    const clean = text.trim();
    if (!clean) return;

    setTasks((prev) => [
      ...prev,
      {
        id: String(Date.now() + Math.random()),
        text: clean,
      },
    ]);
    setText('');
  };

  const removeTask = (id, label) => {
    setTasks((prev) => prev.filter((item) => item.id !== id));
    setTrashCount((prev) => prev + 1);
    setLastRemoved(label);
    setTrashActive(true);

    setTimeout(() => setTrashActive(false), 700);
    setTimeout(() => setLastRemoved(''), 1800);
  };

  return (
    <ScreenFrame tabIndex={7} title="8. Lista com Remoção">
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Nova tarefa</Text>
        <View style={styles.inlineRow}>
          <TextInput
            style={[styles.input, styles.inlineInput]}
            value={text}
            onChangeText={setText}
            placeholder="Ex.: Fazer exercícios"
          />
          <AppButton
            label="Adicionar"
            onPress={addTask}
            color="#C2185B"
            style={styles.inlineAction}
          />
        </View>
      </View>

      <View style={[styles.card, styles.flexCard, { marginTop: 12 }]}>
        <Text style={styles.cardTitle}>Lista</Text>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskText}>{item.text}</Text>
              <Pressable
                onPress={() => removeTask(item.id, item.text)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </Pressable>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Nenhuma tarefa ainda</Text>
              <Text style={styles.emptyText}>
                Adicione itens acima para testar a remoção.
              </Text>
            </View>
          }
        />
      </View>

      <View style={[styles.trashBar, trashActive && styles.trashBarActive]}>
        <Text style={styles.trashIcon}>🗑️</Text>
        <View style={styles.trashTextBox}>
          <Text style={styles.trashTitle}>Lixeira: {trashCount}</Text>
          <Text style={styles.trashDesc}>
            {lastRemoved
              ? `"${lastRemoved}" enviado para a lixeira.`
              : 'Toque no ✕ para remover um item.'}
          </Text>
        </View>
      </View>
    </ScreenFrame>
  );
}

// ======== APLICATIVO PRINCIPAL ========
export default function App() {
  const [currentTab, setCurrentTab] = useState(0);

  const renderScreen = () => {
    switch (currentTab) {
      case 0:
        return <CounterScreen />;
      case 1:
        return <LightScreen />;
      case 2:
        return <NameScreen />;
      case 3:
        return <TasksTagsScreen />;
      case 4:
        return <BombScreen />;
      case 5:
        return <JokeScreen />;
      case 6:
        return <WeatherScreen />;
      case 7:
        return <RemoveTasksScreen />;
      default:
        return <CounterScreen />;
    }
  };

  return (
    <View style={styles.app}>
      <View style={styles.mainArea}>{renderScreen()}</View>

      <View style={styles.tabBar}>
        <View style={styles.tabGrid}>
          {TABS.map((tab, index) => (
            <Pressable
              key={tab.id}
              onPress={() => setCurrentTab(index)}
              style={[styles.tabButton, currentTab === index && styles.tabButtonActive]}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text
                style={[
                  styles.tabButtonText,
                  currentTab === index && styles.tabButtonTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

// ======== ESTILOS GLOBAIS ========
const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#EAF1F8',
  },

  mainArea: {
    flex: 1,
  },

  screen: {
    flex: 1,
  },

  header: {
    height: 72,
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
  },

  headerTextArea: {
    flex: 1,
    paddingRight: 12,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },

  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
  },

  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  helpButtonText: {
    fontSize: 18,
    fontWeight: '900',
  },

  content: {
    flex: 1,
    padding: 8,
  },

  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
  },

  bigCard: {
    backgroundColor: '#17324D',
    borderRadius: 16,
    padding: 14,
  },

  flexCard: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#102A43',
    marginBottom: 6,
  },

  cardLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D9E2EC',
  },

  bigNumber: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
  },

  cardHint: {
    fontSize: 13,
    color: '#5D7083',
    marginTop: 6,
    lineHeight: 18,
  },

  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C8D4E0',
    backgroundColor: '#F8FBFF',
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#102A43',
  },

  button: {
    minHeight: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  buttonText: {
    fontSize: 15,
    fontWeight: '800',
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  footerButton: {
    width: '31%',
  },

  doubleFooterButton: {
    width: '48%',
  },

  wrapButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  halfButton: {
    width: '48%',
    marginBottom: 10,
  },

  fullButton: {
    width: '100%',
  },

  codeSlotsGrid: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  codeSlot: {
    width: '18%',
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCD6E0',
    backgroundColor: '#F7FAFD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },

  codeSlotFilled: {
    borderColor: '#1565C0',
    backgroundColor: '#E8F1FD',
  },

  codeSlotText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#A6B4C2',
  },

  codeSlotTextFilled: {
    color: '#123A66',
  },

  keypadGrid: {
    marginTop: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  keypadKey: {
    width: '30%',
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D7E1EA',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: '1.5%',
    marginBottom: 6,
  },

  keypadKeyPressed: {
    backgroundColor: '#E9F1FB',
    borderColor: '#8BB2DA',
  },

  keypadKeyDisabled: {
    backgroundColor: '#EEF2F6',
    borderColor: '#D9E2EC',
  },

  keypadKeyText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#17324D',
  },

  keypadKeyButton: {
    width: '30%',
    height: 48,
    borderRadius: 10,
    marginHorizontal: '1.5%',
    marginBottom: 6,
    paddingHorizontal: 0,
  },

  sheepBox: {
    flex: 1,
    minHeight: 100,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6E4CF',
    backgroundColor: '#EEF5EA',
  },

  sheepContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },

  sheep: {
    fontSize: 28,
    margin: 4,
  },

  extraText: {
    width: '100%',
    marginTop: 6,
    textAlign: 'center',
    color: '#486581',
    fontSize: 12,
    fontWeight: '700',
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#17324D',
    marginBottom: 6,
    textAlign: 'center',
  },

  emptyText: {
    fontSize: 13,
    color: '#61758A',
    textAlign: 'center',
    lineHeight: 18,
  },

  lightCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    marginBottom: 14,
  },

  statusBig: {
    fontSize: 16,
    fontWeight: '800',
    color: '#17324D',
    textAlign: 'center',
  },

  comboText: {
    color: '#D35400',
    fontWeight: '900',
  },

  messageText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#17324D',
    lineHeight: 30,
  },

  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  inlineInput: {
    flex: 1,
  },

  inlineAction: {
    width: 110,
    marginLeft: 10,
  },

  chipsRow: {
    flexDirection: 'row',
  },

  chip: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D7E1EA',
    backgroundColor: '#F7FAFC',
    marginRight: 8,
  },

  chipActive: {
    backgroundColor: '#7B1FA2',
    borderColor: '#7B1FA2',
  },

  filterChipActive: {
    backgroundColor: '#1565C0',
    borderColor: '#1565C0',
  },

  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#486581',
  },

  chipTextActive: {
    color: '#FFFFFF',
  },

  listContent: {
    paddingBottom: 4,
  },

  taskItem: {
    minHeight: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F9FBFD',
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  taskText: {
    flex: 1,
    fontSize: 15,
    color: '#102A43',
    marginRight: 10,
  },

  tagBadge: {
    borderRadius: 999,
    backgroundColor: '#7B1FA2',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  tagBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  bombClock: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },

  bombClockText: {
    fontSize: 24,
    fontWeight: '900',
  },

  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  typeEmoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 8,
  },

  typeText: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: '#486581',
    marginBottom: 14,
  },

  jokeSetup: {
    fontSize: 19,
    lineHeight: 28,
    color: '#102A43',
    textAlign: 'center',
    marginBottom: 14,
  },

  jokePunch: {
    fontSize: 21,
    lineHeight: 30,
    fontWeight: '900',
    color: '#C62828',
    textAlign: 'center',
    marginBottom: 20,
  },

  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 12,
  },

  ratingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D7E1EA',
    backgroundColor: '#EEF3F8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  ratingButtonActive: {
    backgroundColor: '#1565C0',
    borderColor: '#1565C0',
  },

  ratingButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#17324D',
  },

  ratingButtonTextActive: {
    color: '#FFFFFF',
  },

  starText: {
    textAlign: 'center',
    fontSize: 28,
    color: '#F4B400',
    marginBottom: 10,
  },

  reactionText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#17324D',
  },

  weatherImage: {
    width: 110,
    height: 110,
    marginBottom: 6,
  },

  weatherEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },

  weatherTemp: {
    fontSize: 40,
    fontWeight: '900',
  },

  weatherCondition: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },

  weatherCity: {
    fontSize: 16,
    marginTop: 6,
  },

  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDECEC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  removeButtonText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#C62828',
  },

  trashBar: {
    marginTop: 8,
    minHeight: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D7E1EA',
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  trashBarActive: {
    backgroundColor: '#FFF1F1',
    borderColor: '#F5B7B1',
  },

  trashIcon: {
    fontSize: 28,
    marginRight: 12,
  },

  trashTextBox: {
    flex: 1,
  },

  trashTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#17324D',
    marginBottom: 4,
  },

  trashDesc: {
    fontSize: 13,
    color: '#61758A',
    lineHeight: 18,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(9,30,66,0.42)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },

  modalCard: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#102A43',
    marginBottom: 12,
  },

  modalBox: {
    backgroundColor: '#F8FBFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  modalBoxTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#17324D',
    marginBottom: 6,
  },

  modalText: {
    fontSize: 14,
    color: '#334E68',
    lineHeight: 20,
  },

  tabBar: {
    borderTopWidth: 1,
    borderTopColor: '#D7E1EA',
    backgroundColor: '#FFFFFF',
    paddingTop: 4,
    paddingBottom: 6,
    paddingHorizontal: 2,
  },

  tabGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  tabButton: {
    width: '25%',
    minHeight: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D7E1EA',
    backgroundColor: '#F7FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    paddingVertical: 4,
  },

  tabButtonActive: {
    backgroundColor: '#1565C0',
    borderColor: '#1565C0',
  },

  tabIcon: {
    fontSize: 17,
    marginBottom: 2,
  },

  tabButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#486581',
    textAlign: 'center',
  },

  tabButtonTextActive: {
    color: '#FFFFFF',
  },
});