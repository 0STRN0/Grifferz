import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, TextInput, StyleSheet, ScrollView, SafeAreaView, Modal, Alert, Animated, ActivityIndicator, Dimensions, Linking, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, getIdTokenResult } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc, query, where, orderBy, updateDoc, arrayUnion, arrayRemove, deleteDoc, increment, onSnapshot, serverTimestamp } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

const firebaseConfig = {
  apiKey: "AIzaSyDKOab-7c6zzSy_ujC_AvCztdieruKm3UQ",
  authDomain: "grifferz-cc520.firebaseapp.com",
  projectId: "grifferz-cc520",
  storageBucket: "grifferz-cc520.firebasestorage.app",
  messagingSenderId: "623140091127",
  appId: "1:623140091127:web:ed98326018363c9a230ff2"
};

if (!getApps().length) { initializeApp(firebaseConfig); }
const auth = getAuth();
const db = getFirestore();
const { width, height } = Dimensions.get('window');

const C = {
  bg: '#0a0a0a', prata: '#c0c0c0', prataEscuro: '#a0a0a0',
  roxo: '#7b2ff7', roxoClaro: '#9d4eff', branco: '#ffffff',
  card: '#111111', borda: '#1a1a1a', erro: '#ff2d55', sucesso: '#4caf50', amarelo: '#ffc107', laranja: '#ff9800',
};

const TAMANHOS = ['P', 'M', 'G', 'GG', 'XG', 'XGG'];

export default function App() {
  const [carregando, setCarregando] = useState(true);
  const [progresso, setProgresso] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [logado, setLogado] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [modo, setModo] = useState('login');
  const [tipo, setTipo] = useState('cliente');
  const [nomeMarca, setNomeMarca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [documentoMarca, setDocumentoMarca] = useState(null);
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('home');
  const [usuario, setUsuario] = useState(null);
  const [timelinePosts, setTimelinePosts] = useState([]);
  const [hypezPosts, setHypezPosts] = useState([]);
  const [drops, setDrops] = useState([]);
  const [meusPosts, setMeusPosts] = useState([]);
  const [perfilVisitado, setPerfilVisitado] = useState(null);
  const [modalNovoPost, setModalNovoPost] = useState(false);
  const [modalEditarPerfil, setModalEditarPerfil] = useState(false);
  const [modalComentarios, setModalComentarios] = useState(null);
  const [modalEditarImagem, setModalEditarImagem] = useState(null);
  const [modalVerificacao, setModalVerificacao] = useState(false);
  const [modalNovoProduto, setModalNovoProduto] = useState(false);
  const [modalPagamento, setModalPagamento] = useState(false);
  const [modalMenuPerfil, setModalMenuPerfil] = useState(false);
  const [etapaPost, setEtapaPost] = useState(1);
  const [imagensSelecionadas, setImagensSelecionadas] = useState([]);
  const [legendaPost, setLegendaPost] = useState('');
  const [mencaoPost, setMencaoPost] = useState('');
  const [tipoPost, setTipoPost] = useState('normal');
  const [videoUri, setVideoUri] = useState(null);
  const [comentarioTexto, setComentarioTexto] = useState('');
  const [editNome, setEditNome] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editCategoria, setEditCategoria] = useState('');
  const [editFoto, setEditFoto] = useState('');
  const [likedPosts, setLikedPosts] = useState({});
  const [savedPosts, setSavedPosts] = useState({});
  const [editandoImagem, setEditandoImagem] = useState(null);
  const [manterConectado, setManterConectado] = useState(false);
  const [marcasPendentes, setMarcasPendentes] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [modalCarrinho, setModalCarrinho] = useState(false);
  const [modalCheckout, setModalCheckout] = useState(false);
  const [enderecoEntrega, setEnderecoEntrega] = useState('');
  const [meusPedidos, setMeusPedidos] = useState([]);
  const [vendasMarca, setVendasMarca] = useState([]);
  const [novoProdutoNome, setNovoProdutoNome] = useState('');
  const [novoProdutoPreco, setNovoProdutoPreco] = useState('');
  const [produtoImagens, setProdutoImagens] = useState([]);
  const [produtoVideos, setProdutoVideos] = useState([]);
  const [produtoDescricao, setProdutoDescricao] = useState('');
  const [produtoTags, setProdutoTags] = useState('');
  const [produtoTamanhos, setProdutoTamanhos] = useState([]);
  const [postAmpliado, setPostAmpliado] = useState(null);
  const [stories, setStories] = useState([]);
  const [seguindo, setSeguindo] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [dropzTab, setDropzTab] = useState('produtos');
  const [dropzSearchQuery, setDropzSearchQuery] = useState('');
  const [dropzCategoriaFiltro, setDropzCategoriaFiltro] = useState('Todas');
  const [postCarrosselIndex, setPostCarrosselIndex] = useState(0);
  const [fotoCapa, setFotoCapa] = useState(null);
  const [collabTab, setCollabTab] = useState('marcas');
  const [collabChat, setCollabChat] = useState(null);
  const [collabMensagem, setCollabMensagem] = useState('');
  const [collabMensagens, setCollabMensagens] = useState([]);
  const [collabMarcas, setCollabMarcas] = useState([]);
  const [searchzQuery, setSearchzQuery] = useState('');
  const [todasMarcas, setTodasMarcas] = useState([]);
  const [searchzPerfil, setSearchzPerfil] = useState(null);

  const podePostar = () => {
    return usuario?.tipo === 'marca_aprovada' || usuario?.role === 'admin';
  };

  useEffect(() => {
    registerForPushNotificationsAsync();
    const subscription = Notifications.addNotificationReceivedListener(n => console.log('Notificação:', n));
    return () => subscription.remove();
  }, []);

  async function registerForPushNotificationsAsync() {
    if (Device.isDevice) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;
    }
  }

  useEffect(() => {
    if (logado) {
      const interval = setInterval(() => {
        setStories(prev => prev.filter(s => (Date.now() - s.criadoEm) / 3600000 < 24));
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [logado]);

  const publicarStory = async () => {
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.8 });
    if (!result.canceled && result.assets) {
      setStories(prev => [{ id: 's' + Date.now(), marcaId: usuario.uid, marcaNome: usuario.nome, marcaFoto: usuario.foto, imagem: result.assets[0].uri, criadoEm: Date.now() }, ...prev]);
      Alert.alert('✅ Story publicado!');
    }
  };

  const seguirUsuario = async (targetId) => {
    if (seguindo.includes(targetId)) {
      setSeguindo(prev => prev.filter(id => id !== targetId));
      await updateDoc(doc(db, 'usuarios', usuario.uid), { seguindo: arrayRemove(targetId) });
      await updateDoc(doc(db, 'usuarios', targetId), { seguidores: arrayRemove(usuario.uid) });
    } else {
      setSeguindo(prev => [...prev, targetId]);
      await updateDoc(doc(db, 'usuarios', usuario.uid), { seguindo: arrayUnion(targetId) });
      await updateDoc(doc(db, 'usuarios', targetId), { seguidores: arrayUnion(usuario.uid) });
    }
  };

  // ✅ CORRIGIDO: Pagamento PagSeguro
  const processarPagamento = () => {
    setModalPagamento(false);
    setModalCheckout(false);
    Linking.openURL('https://pagseguro.uol.com.br/');
    finalizarPedido();
  };

  const verificarSessao = async () => {
    try {
      const sessao = await SecureStore.getItemAsync('grifferz_session');
      if (sessao) {
        const dados = JSON.parse(sessao);
        const userCredential = await signInWithEmailAndPassword(auth, dados.email, dados.senha);
        const userDoc = await getDoc(doc(db, 'usuarios', userCredential.user.uid));
        if (userDoc.exists()) {
          const idTokenResult = await userCredential.user.getIdTokenResult(true);
          const userData = { uid: userCredential.user.uid, ...userDoc.data(), role: idTokenResult.claims.role || 'user' };
          setUsuario(userData);
          setSeguindo(userData.seguindo || []);
          if (userData.tipo === 'marca_aprovada' || userData.tipo === 'cliente' || userData.role === 'admin') setLogado(true);
          else if (userData.tipo === 'marca_pendente') setModalVerificacao(true);
        }
      }
    } catch (e) { console.log('Nenhuma sessão'); }
    setCarregando(false);
  };

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    const interval = setInterval(() => {
      setProgresso(prev => {
        if (prev >= 100) { clearInterval(interval); verificarSessao(); return 100; }
        return prev + 20;
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { if (logado && usuario) carregarTodosDados(); }, [logado]);

  const onRefresh = async () => { setRefreshing(true); await carregarTodosDados(); setRefreshing(false); };

  const carregarTodosDados = async () => {
    try {
      const snapPosts = await getDocs(query(collection(db, 'posts'), orderBy('criadoEm', 'desc')));
      const listaPosts = []; const listaHypez = [];
      snapPosts.forEach(doc => {
        const data = { id: doc.id, ...doc.data() };
        if (data.tipo === 'hypez') listaHypez.push(data);
        else listaPosts.push(data);
      });
      setTimelinePosts(listaPosts); setHypezPosts(listaHypez);

      const snapDrops = await getDocs(collection(db, 'drops'));
      const listaDrops = []; snapDrops.forEach(doc => listaDrops.push({ id: doc.id, ...doc.data() }));
      setDrops(listaDrops);

      // ✅ CARREGA MEUS POSTS SEMPRE (Admin e Marca)
      if (podePostar()) {
        const snapMeus = await getDocs(query(collection(db, 'posts'), where('marcaId', '==', usuario.uid), orderBy('criadoEm', 'desc')));
        const listaMeus = []; snapMeus.forEach(doc => listaMeus.push({ id: doc.id, ...doc.data() }));
        setMeusPosts(listaMeus);

        const snapVendas = await getDocs(query(collection(db, 'pedidos'), where('marcaId', '==', usuario.uid), orderBy('criadoEm', 'desc')));
        const listaVendas = []; snapVendas.forEach(doc => listaVendas.push({ id: doc.id, ...doc.data() }));
        setVendasMarca(listaVendas);
      }

      // ✅ TODAS as marcas aprovadas
      const snapTodas = await getDocs(query(collection(db, 'usuarios'), where('tipo', '==', 'marca_aprovada')));
      const listaTodas = []; snapTodas.forEach(doc => listaTodas.push({ id: doc.id, ...doc.data() }));
      setTodasMarcas(listaTodas);
      // ✅ Collabz: inclui TODAS as marcas, sem filtrar a própria
      setCollabMarcas(listaTodas);

      const snapPedidos = await getDocs(query(collection(db, 'pedidos'), where('clienteId', '==', usuario?.uid), orderBy('criadoEm', 'desc')));
      const listaPedidos = []; snapPedidos.forEach(doc => listaPedidos.push({ id: doc.id, ...doc.data() }));
      setMeusPedidos(listaPedidos);
    } catch (e) { console.log(e); }
  };

  const adicionarAoCarrinho = (p) => {
    const ex = carrinho.find(i => i.id === p.id);
    if (ex) setCarrinho(carrinho.map(i => i.id === p.id ? { ...i, quantidade: i.quantidade + 1 } : i));
    else setCarrinho([...carrinho, { ...p, quantidade: 1 }]);
  };
  const removerDoCarrinho = (id) => setCarrinho(carrinho.filter(i => i.id !== id));
  const totalCarrinho = carrinho.reduce((t, i) => {
    const pr = parseFloat(i.price.replace(/[^0-9,]/g, '').replace(',', '.'));
    return t + (pr * (i.quantidade || 1));
  }, 0);

  const finalizarPedido = async () => {
    if (!enderecoEntrega.trim() || carrinho.length === 0) { Alert.alert('Erro'); return; }
    try {
      await addDoc(collection(db, 'pedidos'), {
        clienteId: usuario.uid, clienteNome: usuario.nome, produtos: carrinho,
        total: totalCarrinho.toFixed(2), endereco: enderecoEntrega.trim(),
        status: 'pendente', criadoEm: new Date().toISOString(), marcaId: carrinho[0].marcaId,
      });
      setCarrinho([]); setModalCheckout(false); setEnderecoEntrega('');
      Alert.alert('✅ Pedido realizado!'); carregarTodosDados();
    } catch (e) { Alert.alert('Erro'); }
  };

  const atualizarStatusPedido = async (id, st) => {
    await updateDoc(doc(db, 'pedidos', id), { status: st });
    Alert.alert('✅ Atualizado!'); carregarTodosDados();
  };

  const selecionarImagensProduto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsMultipleSelection: true, selectionLimit: 10, quality: 0.8,
    });
    if (!result.canceled && result.assets) {
      setProdutoImagens(prev => [...prev, ...result.assets.map(a => a.uri)].slice(0, 10));
    }
  };
  const selecionarVideosProduto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos, allowsMultipleSelection: true, selectionLimit: 2, quality: 0.8,
    });
    if (!result.canceled && result.assets) {
      setProdutoVideos(prev => [...prev, ...result.assets.map(a => a.uri)].slice(0, 2));
    }
  };
  const removerImagemProduto = (index) => setProdutoImagens(prev => prev.filter((_, i) => i !== index));
  const removerVideoProduto = (index) => setProdutoVideos(prev => prev.filter((_, i) => i !== index));
  const toggleTamanho = (tam) => setProdutoTamanhos(prev => prev.includes(tam) ? prev.filter(t => t !== tam) : [...prev, tam]);

  const adicionarProduto = async () => {
    if (!novoProdutoNome.trim() || !novoProdutoPreco.trim()) { Alert.alert('Preencha nome e preço!'); return; }
    if (produtoImagens.length === 0) { Alert.alert('Adicione pelo menos uma imagem!'); return; }
    try {
      await addDoc(collection(db, 'drops'), {
        marcaId: usuario.uid, brand: usuario.nome, name: novoProdutoNome.trim(),
        price: 'R$ ' + novoProdutoPreco.trim(), images: produtoImagens, videos: produtoVideos,
        descricao: produtoDescricao.trim(),
        tags: produtoTags.trim().split(',').map(t => t.trim().toLowerCase()).filter(t => t),
        tamanhos: produtoTamanhos,
        countdown: 'Disponível', criadoEm: new Date().toISOString(),
      });
      setModalNovoProduto(false); setNovoProdutoNome(''); setNovoProdutoPreco('');
      setProdutoImagens([]); setProdutoVideos([]); setProdutoDescricao(''); setProdutoTags(''); setProdutoTamanhos([]);
      Alert.alert('✅ Produto adicionado!'); carregarTodosDados();
    } catch (e) { Alert.alert('Erro ao adicionar'); }
  };

  const comprarProduto = (p) => { adicionarAoCarrinho(p); Alert.alert('✅ Adicionado!', 'Produto adicionado ao carrinho.'); };

  const carregarMarcasPendentes = async () => {
    const q = query(collection(db, 'usuarios'), where('tipo', '==', 'marca_pendente'));
    const sn = await getDocs(q); const pend = []; sn.forEach(d => pend.push({ id: d.id, ...d.data() }));
    setMarcasPendentes(pend);
  };
  const aprovarMarca = async (id) => { await updateDoc(doc(db, 'usuarios', id), { tipo: 'marca_aprovada', status: 'aprovado' }); Alert.alert('✅'); carregarMarcasPendentes(); };
  const rejeitarMarca = async (id) => {
    Alert.alert('Rejeitar', 'Confirmar?', [{ text: 'Sim', style: 'destructive', onPress: async () => { await updateDoc(doc(db, 'usuarios', id), { tipo: 'cliente', status: 'rejeitado' }); Alert.alert('❌'); carregarMarcasPendentes(); } }, { text: 'Cancelar', style: 'cancel' }]);
  };

  const selecionarFotoCapa = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.8 });
    if (!result.canceled && result.assets) {
      setFotoCapa(result.assets[0].uri);
      await updateDoc(doc(db, 'usuarios', usuario.uid), { fotoCapa: result.assets[0].uri });
    }
  };

  const solicitarDocumento = async () => { const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 }); if (!r.canceled && r.assets) setDocumentoMarca(r.assets[0].uri); };
  const tirarFoto = async () => { const { status } = await ImagePicker.requestCameraPermissionsAsync(); if (status !== 'granted') return; const r = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.8 }); if (!r.canceled && r.assets) setImagensSelecionadas(prev => [...prev, r.assets[0].uri]); };
  const selecionarImagens = async () => { Alert.alert('Selecionar', 'De onde?', [{ text: 'Galeria', onPress: async () => { const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsMultipleSelection: true, selectionLimit: 10, quality: 0.8 }); if (!r.canceled && r.assets) setImagensSelecionadas(prev => [...prev, ...r.assets.map(a => a.uri)]); } }, { text: 'Câmera', onPress: tirarFoto }, { text: 'Cancelar', style: 'cancel' }]); };
  const selecionarVideo = async () => { Alert.alert('Selecionar', 'De onde?', [{ text: 'Galeria', onPress: async () => { const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Videos, quality: 0.8 }); if (!r.canceled && r.assets) setVideoUri(r.assets[0].uri); } }, { text: 'Câmera', onPress: async () => { const { status } = await ImagePicker.requestCameraPermissionsAsync(); if (status !== 'granted') return; const r = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Videos, quality: 0.8 }); if (!r.canceled && r.assets) setVideoUri(r.assets[0].uri); } }, { text: 'Cancelar', style: 'cancel' }]); };
  const abrirEditorImagem = (uri) => { setEditandoImagem(uri); setModalEditarImagem(true); };
  const aplicarEdicaoImagem = async (acao, valor) => { if (!editandoImagem) return; try { const acoes = []; if (acao === 'cortar') acoes.push({ crop: { originX: 50, originY: 50, width: valor || 400, height: valor || 400 } }); else if (acao === 'redimensionar') acoes.push({ resize: { width: valor || 1080 } }); else if (acao === 'rotacionar') acoes.push({ rotate: valor || 90 }); const r = await ImageManipulator.manipulateAsync(editandoImagem, acoes, { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }); setEditandoImagem(r.uri); Alert.alert('✅ Editado!'); } catch (e) { Alert.alert('Erro'); } };
  const salvarEdicao = () => { if (editandoImagem) { setImagensSelecionadas(prev => { const idx = prev.findIndex(img => img === editandoImagem || prev.includes(editandoImagem)); if (idx >= 0) { const n = [...prev]; n[idx] = editandoImagem; return n; } return [...prev, editandoImagem]; }); } setModalEditarImagem(false); setEditandoImagem(null); };
  const selecionarFotoPerfil = async () => { const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8 }); if (!r.canceled && r.assets) { const m = await ImageManipulator.manipulateAsync(r.assets[0].uri, [{ resize: { width: 400, height: 400 } }], { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }); setEditFoto(m.uri); } };
  const avancarEtapa = () => { if (imagensSelecionadas.length === 0 && !videoUri) { Alert.alert('Selecione imagem ou vídeo!'); return; } setEtapaPost(2); };
  
  // ✅ CORRIGIDO: publicarPost agora chama carregarTodosDados para atualizar o grid
  const publicarPost = async () => {
    if (!podePostar()) return;
    if (!legendaPost.trim()) { Alert.alert('Adicione legenda!'); return; }
    try {
      await addDoc(collection(db, 'posts'), {
        marcaId: usuario.uid, marcaNome: usuario.nome, marcaFoto: usuario.foto,
        imagens: imagensSelecionadas, video: videoUri, desc: legendaPost.trim(),
        mencao: mencaoPost.trim(), tipo: tipoPost, likes: 0, comments: [], reposts: 0,
        data: 'Agora', criadoEm: new Date().toISOString()
      });
      limparFormPost();
      await carregarTodosDados(); // ✅ Atualiza a lista de posts
      Alert.alert('✅ Publicado!');
    } catch (e) { Alert.alert('Erro'); }
  };
  
  const limparFormPost = () => { setModalNovoPost(false); setEtapaPost(1); setImagensSelecionadas([]); setVideoUri(null); setLegendaPost(''); setMencaoPost(''); setTipoPost('normal'); };

  // ✅ CORRIGIDO: handleLike não recarrega a timeline
  const handleLike = async (postId) => {
    const ref = doc(db, 'posts', postId);
    const post = timelinePosts.find(p => p.id === postId) || hypezPosts.find(p => p.id === postId);
    if (!post) return;
    const jaCurtiu = likedPosts[postId];
    await updateDoc(ref, { likes: jaCurtiu ? post.likes - 1 : post.likes + 1 });
    setLikedPosts(prev => ({ ...prev, [postId]: !jaCurtiu }));
    setTimelinePosts(prev => prev.map(p => p.id === postId ? { ...p, likes: jaCurtiu ? p.likes - 1 : p.likes + 1 } : p));
    setHypezPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: jaCurtiu ? p.likes - 1 : p.likes + 1 } : p));
  };

  const handleSave = (postId) => { setSavedPosts(prev => ({ ...prev, [postId]: !prev[postId] })); };
  const handleRepost = async (postId) => {
    await updateDoc(doc(db, 'posts', postId), { reposts: increment(1) });
    Alert.alert('✅ Repostado!');
    setTimelinePosts(prev => prev.map(p => p.id === postId ? { ...p, reposts: (p.reposts || 0) + 1 } : p));
  };
  const handleExcluirPost = (postId) => { Alert.alert('🗑️ Excluir Post', 'Confirmar?', [{ text: 'Excluir', style: 'destructive', onPress: async () => { await deleteDoc(doc(db, 'posts', postId)); Alert.alert('✅ Excluído!'); carregarTodosDados(); } }, { text: 'Cancelar', style: 'cancel' }]); };
  const abrirComentarios = (postId) => setModalComentarios(postId);
  const enviarComentario = async () => { if (!comentarioTexto.trim() || !modalComentarios) return; await updateDoc(doc(db, 'posts', modalComentarios), { comments: arrayUnion({ texto: comentarioTexto, autor: usuario?.nome || 'Anônimo', data: 'Agora' }) }); setComentarioTexto(''); setModalComentarios(null); };

  useEffect(() => {
    if (collabChat) {
      const q = query(collection(db, 'collabz_messages'), where('chatId', '==', collabChat.id), orderBy('timestamp'));
      const unsub = onSnapshot(q, (snapshot) => {
        const msgs = [];
        snapshot.forEach(doc => msgs.push({ id: doc.id, ...doc.data() }));
        setCollabMensagens(msgs);
      });
      return () => unsub();
    }
  }, [collabChat]);

  const enviarMensagemCollab = async () => {
    if (!collabMensagem.trim() || !collabChat) return;
    await addDoc(collection(db, 'collabz_messages'), {
      chatId: collabChat.id, senderId: usuario.uid, senderNome: usuario.nome,
      texto: collabMensagem.trim(), timestamp: serverTimestamp(),
    });
    setCollabMensagem('');
  };

  const handleCadastro = async () => {
    setErro('');
    if (!email.trim() || !senha.trim()) { setErro('Preencha todos!'); return; }
    if (senha.length < 6) { setErro('Senha: 6+ caracteres!'); return; }
    if (senha !== confirmarSenha) { setErro('Senhas não conferem!'); return; }
    if (tipo === 'marca' && (!nomeMarca.trim() || !cnpj.trim() || !documentoMarca || !aceitouTermos)) { setErro('Preencha todos os dados da marca!'); return; }
    setLoading(true);
    try {
      const uc = await createUserWithEmailAndPassword(auth, email.trim(), senha);
      const data = { email: email.trim(), tipo: tipo === 'marca' ? 'marca_pendente' : 'cliente', nome: tipo === 'marca' ? nomeMarca : email.split('@')[0], usuario: '@' + email.split('@')[0], bio: 'Novo no Grifferz', foto: 'https://picsum.photos/200?random=' + Math.floor(Math.random() * 1000), categoria: tipo === 'marca' ? (categoria || 'Moda') : '', cnpj: tipo === 'marca' ? cnpj : '', documentoMarca: tipo === 'marca' ? documentoMarca : '', status: tipo === 'marca' ? 'pendente' : 'aprovado', fotoCapa: null, seguidores: [], seguindo: [], criadoEm: new Date().toISOString() };
      await setDoc(doc(db, 'usuarios', uc.user.uid), data);
      setUsuario({ uid: uc.user.uid, ...data });
      setSeguindo([]);
      if (tipo === 'marca') setModalVerificacao(true); else { setLogado(true); setTab('home'); }
    } catch (e) { setErro('Erro: ' + e.message); } finally { setLoading(false); }
  };

  const handleLogin = async () => {
    setErro(''); if (!email.trim() || !senha.trim()) { setErro('Preencha todos!'); return; }
    setLoading(true);
    try {
      const uc = await signInWithEmailAndPassword(auth, email.trim(), senha);
      const ud = await getDoc(doc(db, 'usuarios', uc.user.uid));
      if (ud.exists()) {
        const idr = await uc.user.getIdTokenResult(true);
        const data = { uid: uc.user.uid, ...ud.data(), role: idr.claims.role || 'user' };
        setUsuario(data);
        setSeguindo(data.seguindo || []);
        if (manterConectado) await SecureStore.setItemAsync('grifferz_session', JSON.stringify({ email: email.trim(), senha }));
        if (data.tipo === 'marca_pendente') setModalVerificacao(true); else { setLogado(true); setTab('home'); }
      }
    } catch (e) { setErro('Erro: ' + e.message); } finally { setLoading(false); }
  };

  const handleLogout = async () => { await signOut(auth); await SecureStore.deleteItemAsync('grifferz_session'); setLogado(false); setUsuario(null); setPerfilVisitado(null); setCarrinho([]); setSearchzPerfil(null); };

  const handleExcluirConta = () => {
    Alert.alert('⚠️ Excluir Conta', 'Todos os dados serão removidos.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
          const u = auth.currentUser; if (!u) return;
          await deleteDoc(doc(db, 'usuarios', u.uid));
          (await getDocs(query(collection(db, 'posts'), where('marcaId', '==', u.uid)))).forEach(async d => { await deleteDoc(doc(db, 'posts', d.id)); });
          (await getDocs(query(collection(db, 'drops'), where('marcaId', '==', u.uid)))).forEach(async d => { await deleteDoc(doc(db, 'drops', d.id)); });
          await u.delete(); await SecureStore.deleteItemAsync('grifferz_session');
          setLogado(false); setUsuario(null); Alert.alert('✅ Conta excluída');
        }
      }
    ]);
  };

  const handleEditarPerfil = async () => {
    await updateDoc(doc(db, 'usuarios', usuario.uid), { nome: editNome, bio: editBio, categoria: editCategoria, foto: editFoto || usuario.foto });
    setUsuario({ ...usuario, nome: editNome, bio: editBio, categoria: editCategoria, foto: editFoto || usuario.foto });
    setModalEditarPerfil(false); setModalMenuPerfil(false); Alert.alert('✅ Atualizado!');
  };

  const abrirEditarPerfil = () => { setEditNome(usuario?.nome || ''); setEditBio(usuario?.bio || ''); setEditCategoria(usuario?.categoria || ''); setEditFoto(usuario?.foto || ''); setModalEditarPerfil(true); };

  // ✅ CORRIGIDO: abrirPerfilSearchz funcional
  const abrirPerfilSearchz = async (marcaId) => {
    const ud = await getDoc(doc(db, 'usuarios', marcaId));
    if (ud.exists()) {
      const sp = await getDocs(query(collection(db, 'posts'), where('marcaId', '==', marcaId), orderBy('criadoEm', 'desc')));
      const posts = []; sp.forEach(d => posts.push({ id: d.id, ...d.data() }));
      setSearchzPerfil({ ...ud.data(), id: marcaId, posts });
    }
  };

  // ======================== TELAS ========================
  if (carregando) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center' }}>
        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <Image source={require('./assets/grifferz-logo.png')} style={{ width: 150, height: 150, resizeMode: 'contain' }} />
          <View style={{ marginTop: 50, width: '70%' }}>
            <View style={{ width: '100%', height: 3, backgroundColor: C.borda, borderRadius: 2 }}>
              <View style={{ width: progresso + '%', height: '100%', backgroundColor: C.roxo, borderRadius: 2 }} />
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }

  if (modalVerificacao) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg, justifyContent: 'center', alignItems: 'center', padding: 30 }}>
        <Ionicons name="time-outline" size={80} color={C.laranja} />
        <Text style={{ color: C.prata, fontSize: 22, fontWeight: '700', textAlign: 'center', marginTop: 20 }}>Cadastro em Análise</Text>
        <TouchableOpacity style={[s.btnPrincipal, { marginTop: 30, width: '100%' }]} onPress={handleLogout}><Text style={{ color: C.branco, fontWeight: '700' }}>Sair e aguardar</Text></TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!logado) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 80 }}>
          <Image source={require('./assets/grifferz-logo.png')} style={{ width: 120, height: 120, resizeMode: 'contain', alignSelf: 'center', marginBottom: 20 }} />
          <Text style={{ color: C.prata, fontSize: 32, fontWeight: '900', letterSpacing: 6, textAlign: 'center' }}>GRIFFERZ</Text>
          <View style={{ flexDirection: 'row', backgroundColor: C.card, borderRadius: 25, padding: 4, marginTop: 30, marginBottom: 20 }}>
            <TouchableOpacity style={[s.modoBtn, modo === 'login' && s.modoBtnAtivo]} onPress={() => setModo('login')}><Text style={{ color: modo === 'login' ? C.branco : C.prataEscuro, fontWeight: '600' }}>Entrar</Text></TouchableOpacity>
            <TouchableOpacity style={[s.modoBtn, modo === 'cadastro' && s.modoBtnAtivo]} onPress={() => setModo('cadastro')}><Text style={{ color: modo === 'cadastro' ? C.branco : C.prataEscuro, fontWeight: '600' }}>Criar Conta</Text></TouchableOpacity>
          </View>
          {modo === 'cadastro' && (
            <View style={{ marginBottom: 15 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 15, marginBottom: 15 }}>
                <TouchableOpacity style={[s.tipoCard, tipo === 'cliente' && { borderColor: C.roxo }]} onPress={() => setTipo('cliente')}><Ionicons name="person" size={35} color={tipo === 'cliente' ? C.roxo : C.prataEscuro} /><Text style={{ color: tipo === 'cliente' ? C.branco : C.prataEscuro }}>Cliente</Text></TouchableOpacity>
                <TouchableOpacity style={[s.tipoCard, tipo === 'marca' && { borderColor: C.roxo }]} onPress={() => setTipo('marca')}><Ionicons name="storefront" size={35} color={tipo === 'marca' ? C.roxo : C.prataEscuro} /><Text style={{ color: tipo === 'marca' ? C.branco : C.prataEscuro }}>Marca</Text></TouchableOpacity>
              </View>
              {tipo === 'marca' && (
                <>
                  <TextInput style={s.input} placeholder="Nome da Marca" placeholderTextColor={C.prataEscuro} value={nomeMarca} onChangeText={setNomeMarca} />
                  <TextInput style={s.input} placeholder="Categoria" placeholderTextColor={C.prataEscuro} value={categoria} onChangeText={setCategoria} />
                  <TextInput style={s.input} placeholder="CNPJ" placeholderTextColor={C.prataEscuro} value={cnpj} onChangeText={setCnpj} keyboardType="numeric" />
                  <TouchableOpacity style={s.btnUploadDoc} onPress={solicitarDocumento}><Ionicons name="document-attach" size={24} color={C.roxo} /><Text style={{ color: C.prata, marginLeft: 10 }}>{documentoMarca ? '✅ Anexado' : '📎 Anexar CNPJ'}</Text></TouchableOpacity>
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, gap: 8 }} onPress={() => setAceitouTermos(!aceitouTermos)}>
                    <Ionicons name={aceitouTermos ? "checkbox" : "square-outline"} size={20} color={aceitouTermos ? C.roxo : C.prataEscuro} />
                    <Text style={{ color: C.prataEscuro, fontSize: 11, flex: 1 }}>Li e aceito os <Text style={{ color: C.roxoClaro }} onPress={() => Linking.openURL('https://0strn0.github.io/grifferz-legal/termos-de-uso.html')}>Termos</Text> e a <Text style={{ color: C.roxoClaro }} onPress={() => Linking.openURL('https://0strn0.github.io/grifferz-legal/politica-privacidade.html')}>Privacidade</Text></Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
          {erro ? <View style={s.erroBox}><Text style={{ color: C.erro, textAlign: 'center' }}>{erro}</Text></View> : null}
          <TextInput style={s.input} placeholder="Email" placeholderTextColor={C.prataEscuro} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextInput style={s.input} placeholder="Senha" placeholderTextColor={C.prataEscuro} value={senha} onChangeText={setSenha} secureTextEntry />
          {modo === 'cadastro' && <TextInput style={s.input} placeholder="Confirmar Senha" placeholderTextColor={C.prataEscuro} value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry />}
          {modo === 'login' && (
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 8 }} onPress={() => setManterConectado(!manterConectado)}>
              <Ionicons name={manterConectado ? "checkbox" : "square-outline"} size={20} color={manterConectado ? C.roxo : C.prataEscuro} /><Text style={{ color: C.prataEscuro, fontSize: 12 }}>Mantenha-me conectado</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={s.btnPrincipal} onPress={modo === 'login' ? handleLogin : handleCadastro} disabled={loading}><Text style={{ color: C.branco, fontWeight: '700', fontSize: 16 }}>{loading ? 'Carregando...' : modo === 'login' ? 'Entrar' : 'Criar Conta'}</Text></TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ✅ SEARCHZ PERFIL VISUALIZADOR
  if (searchzPerfil) {
    const p = searchzPerfil;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 50, gap: 10 }}>
          <TouchableOpacity onPress={() => setSearchzPerfil(null)}><Ionicons name="arrow-back" size={24} color={C.prata} /></TouchableOpacity>
          <Text style={{ color: C.prata, fontSize: 18, fontWeight: '700' }}>{p.usuario}</Text>
        </View>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.roxo} colors={[C.roxo]} />}>
          {p.fotoCapa && <Image source={{ uri: p.fotoCapa }} style={{ width: '100%', height: 200 }} />}
          <View style={{ alignItems: 'center', padding: 20, marginTop: p.fotoCapa ? -50 : 0 }}>
            <Image source={{ uri: p.foto || 'https://picsum.photos/200' }} style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: C.bg }} />
            <Text style={{ color: C.prata, fontSize: 22, fontWeight: '700', marginTop: 10 }}>{p.nome}</Text>
            <Text style={{ color: C.prataEscuro }}>{p.usuario}</Text>
            <Text style={{ color: C.prataEscuro }}>{p.bio}</Text>
            <Text style={{ color: C.roxoClaro, fontSize: 11 }}>{p.categoria}</Text>
            <TouchableOpacity style={[s.btnAcao, { backgroundColor: seguindo.includes(p.id) ? C.card : C.roxo, borderWidth: seguindo.includes(p.id) ? 1 : 0, borderColor: C.borda, marginTop: 10, paddingHorizontal: 20 }]} onPress={() => seguirUsuario(p.id)}>
              <Text style={{ color: C.branco, fontSize: 12 }}>{seguindo.includes(p.id) ? 'Seguindo' : 'Seguir'}</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: 30, marginTop: 15 }}>
              <View style={{ alignItems: 'center' }}><Text style={{ color: C.prata, fontWeight: '700', fontSize: 18 }}>{p.posts?.length || 0}</Text><Text style={{ color: C.prataEscuro, fontSize: 11 }}>Posts</Text></View>
              <View style={{ alignItems: 'center' }}><Text style={{ color: C.prata, fontWeight: '700', fontSize: 18 }}>{p.seguidores?.length || 0}</Text><Text style={{ color: C.prataEscuro, fontSize: 11 }}>Seguidores</Text></View>
              <View style={{ alignItems: 'center' }}><Text style={{ color: C.prata, fontWeight: '700', fontSize: 18 }}>{p.seguindo?.length || 0}</Text><Text style={{ color: C.prataEscuro, fontSize: 11 }}>Seguindo</Text></View>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 20 }}>
              {p.posts?.map(post => (
                <TouchableOpacity key={post.id} style={{ width: '33.33%', padding: 1 }} onPress={() => setPostAmpliado(post)}>
                  <Image source={{ uri: post.imagens?.[0] || 'https://picsum.photos/200' }} style={{ width: '100%', height: 130 }} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (perfilVisitado) {
    const p = perfilVisitado;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 50, gap: 10 }}>
          <TouchableOpacity onPress={() => setPerfilVisitado(null)}><Ionicons name="arrow-back" size={24} color={C.prata} /></TouchableOpacity>
          <Text style={{ color: C.prata, fontSize: 18, fontWeight: '700' }}>{p.usuario}</Text>
        </View>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.roxo} colors={[C.roxo]} />}>
          {p.fotoCapa && <Image source={{ uri: p.fotoCapa }} style={{ width: '100%', height: 200 }} />}
          <View style={{ alignItems: 'center', padding: 20, marginTop: p.fotoCapa ? -50 : 0 }}>
            <Image source={{ uri: p.foto || 'https://picsum.photos/200' }} style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: C.bg }} />
            <Text style={{ color: C.prata, fontSize: 22, fontWeight: '700', marginTop: 10 }}>{p.nome}</Text>
            <Text style={{ color: C.prataEscuro }}>{p.usuario}</Text>
            <Text style={{ color: C.prataEscuro }}>{p.bio}</Text>
            <Text style={{ color: C.roxoClaro, fontSize: 11 }}>{p.categoria}</Text>
            <TouchableOpacity style={[s.btnAcao, { backgroundColor: seguindo.includes(p.id) ? C.card : C.roxo, borderWidth: seguindo.includes(p.id) ? 1 : 0, borderColor: C.borda, marginTop: 10, paddingHorizontal: 20 }]} onPress={() => seguirUsuario(p.id)}>
              <Text style={{ color: C.branco, fontSize: 12 }}>{seguindo.includes(p.id) ? 'Seguindo' : 'Seguir'}</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: 30, marginTop: 15 }}>
              <View style={{ alignItems: 'center' }}><Text style={{ color: C.prata, fontWeight: '700', fontSize: 18 }}>{p.posts?.length || 0}</Text><Text style={{ color: C.prataEscuro, fontSize: 11 }}>Posts</Text></View>
              <View style={{ alignItems: 'center' }}><Text style={{ color: C.prata, fontWeight: '700', fontSize: 18 }}>{p.seguidores?.length || 0}</Text><Text style={{ color: C.prataEscuro, fontSize: 11 }}>Seguidores</Text></View>
              <View style={{ alignItems: 'center' }}><Text style={{ color: C.prata, fontWeight: '700', fontSize: 18 }}>{p.seguindo?.length || 0}</Text><Text style={{ color: C.prataEscuro, fontSize: 11 }}>Seguindo</Text></View>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 20 }}>
              {p.posts?.map(post => (
                <TouchableOpacity key={post.id} style={{ width: '33.33%', padding: 1 }} onPress={() => setPostAmpliado(post)}>
                  <Image source={{ uri: post.imagens?.[0] || 'https://picsum.photos/200' }} style={{ width: '100%', height: 130 }} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const tabsBase = [
    { key: 'home', icon: 'home', label: 'Home' },
    { key: 'searchz', icon: 'search', label: 'Searchz' },
    { key: 'hypez', icon: 'play-circle', label: 'Hypez' },
    { key: 'drops', icon: 'flash', label: 'Dropz' },
  ];
  const tabsMarca = [...tabsBase, { key: 'collabz', icon: 'chatbubbles', label: 'Collabz' }];
  const tabsAdmin = usuario?.role === 'admin' ? [{ key: 'admin', icon: 'shield-checkmark', label: 'Admin' }] : [];
  const tabsFinal = [...(podePostar() ? tabsMarca : tabsBase), ...tabsAdmin, { key: 'profile', icon: 'person', label: 'Perfil' }];

  // 🔍 SEARCHZ
  const SearchzScreen = () => {
    const filtradas = todasMarcas.filter(m =>
      m.nome?.toLowerCase().includes(searchzQuery.toLowerCase()) ||
      m.usuario?.toLowerCase().includes(searchzQuery.toLowerCase()) ||
      m.categoria?.toLowerCase().includes(searchzQuery.toLowerCase())
    );
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <View style={{ padding: 16, paddingTop: 50 }}>
          <Text style={{ color: C.prata, fontSize: 26, fontWeight: '900', letterSpacing: 3 }}>Searchz</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 25, paddingHorizontal: 15, marginTop: 10, borderWidth: 1, borderColor: C.borda }}>
            <Ionicons name="search" size={18} color={C.prataEscuro} />
            <TextInput style={{ flex: 1, color: C.branco, paddingVertical: 12, marginLeft: 8, fontSize: 13 }} placeholder="Buscar marcas..." placeholderTextColor={C.prataEscuro} value={searchzQuery} onChangeText={setSearchzQuery} />
          </View>
        </View>
        <FlatList
          data={filtradas}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: C.borda }} onPress={() => abrirPerfilSearchz(item.id)}>
              <Image source={{ uri: item.foto || 'https://picsum.photos/40' }} style={{ width: 50, height: 50, borderRadius: 25 }} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ color: C.prata, fontWeight: '700' }}>{item.nome}</Text>
                <Text style={{ color: C.prataEscuro, fontSize: 12 }}>{item.usuario}</Text>
                <Text style={{ color: C.roxoClaro, fontSize: 11 }}>{item.categoria}</Text>
              </View>
              <TouchableOpacity onPress={() => seguirUsuario(item.id)}>
                <Text style={{ color: seguindo.includes(item.id) ? C.prataEscuro : C.roxo, fontSize: 12, fontWeight: '600' }}>
                  {seguindo.includes(item.id) ? 'Seguindo' : 'Seguir'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<View style={{ padding: 40, alignItems: 'center' }}><Text style={{ color: C.prataEscuro }}>Nenhuma marca encontrada</Text></View>}
        />
      </SafeAreaView>
    );
  };

  // DROPZ
  const DropsScreen = () => {
    const produtosFiltrados = drops.filter(d => {
      const query = dropzSearchQuery.toLowerCase();
      const matchSearch = !query || d.name?.toLowerCase().includes(query) || d.brand?.toLowerCase().includes(query) || d.descricao?.toLowerCase().includes(query) || d.tags?.some(tag => tag.includes(query));
      const matchCategoria = dropzCategoriaFiltro === 'Todas' || d.categoria === dropzCategoriaFiltro || d.tags?.includes(dropzCategoriaFiltro.toLowerCase());
      return matchSearch && matchCategoria;
    });

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 5 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
            <Text style={{ color: C.prata, fontSize: 26, fontWeight: '900', letterSpacing: 3 }}>Dropz 🔥</Text>
            <TouchableOpacity onPress={() => setModalCarrinho(true)} style={{ position: 'relative' }}>
              <Ionicons name="cart-outline" size={28} color={C.roxo} />
              {carrinho.length > 0 && <View style={{ position: 'absolute', top: -5, right: -8, backgroundColor: C.erro, borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: C.branco, fontSize: 10, fontWeight: '700' }}>{carrinho.length}</Text></View>}
            </TouchableOpacity>
          </View>
          {podePostar() && <TouchableOpacity onPress={() => setModalNovoProduto(true)}><Ionicons name="add-circle" size={28} color={C.roxo} /></TouchableOpacity>}
        </View>
        <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 25, paddingHorizontal: 15, borderWidth: 1, borderColor: C.borda }}>
            <Ionicons name="search" size={18} color={C.prataEscuro} />
            <TextInput style={{ flex: 1, color: C.branco, paddingVertical: 12, marginLeft: 8, fontSize: 13 }} placeholder="Buscar..." placeholderTextColor={C.prataEscuro} value={dropzSearchQuery} onChangeText={setDropzSearchQuery} />
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16, marginBottom: 8 }}>
          {['Todas', 'Roupas', 'Calçados', 'Acessórios', 'Joias', 'Bolsas'].map(cat => (
            <TouchableOpacity key={cat} style={[s.chipFiltro, dropzCategoriaFiltro === cat && { backgroundColor: C.roxo }]} onPress={() => setDropzCategoriaFiltro(cat)}>
              <Text style={{ color: dropzCategoriaFiltro === cat ? C.branco : C.prataEscuro, fontSize: 11, fontWeight: '600' }}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 10 }}>
          <TouchableOpacity style={[s.chipFiltro, dropzTab === 'produtos' && { backgroundColor: C.roxo }]} onPress={() => setDropzTab('produtos')}>
            <Text style={{ color: dropzTab === 'produtos' ? C.branco : C.prataEscuro, fontWeight: '600', fontSize: 12 }}>🛍️ Produtos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.chipFiltro, dropzTab === 'pedidos' && { backgroundColor: C.roxo }]} onPress={() => setDropzTab('pedidos')}>
            <Text style={{ color: dropzTab === 'pedidos' ? C.branco : C.prataEscuro, fontWeight: '600', fontSize: 12 }}>📦 {podePostar() ? 'Vendas' : 'Meus Pedidos'}</Text>
          </TouchableOpacity>
        </View>
        {dropzTab === 'produtos' ? (
          <FlatList data={produtosFiltrados} numColumns={2} keyExtractor={item => item.id} columnWrapperStyle={{ paddingHorizontal: 12, gap: 10 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.roxo} colors={[C.roxo]} />}
            ListEmptyComponent={<View style={{ padding: 40, alignItems: 'center' }}><Ionicons name="search-outline" size={50} color={C.borda} /><Text style={{ color: C.prataEscuro, marginTop: 10 }}>Nenhum produto</Text></View>}
            renderItem={({ item }) => (
              <TouchableOpacity style={s.produtoCard}>
                <Image source={{ uri: item.images?.[0] || item.image }} style={{ width: '100%', height: 180, borderTopLeftRadius: 12, borderTopRightRadius: 12 }} />
                {item.images?.length > 1 && <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 }}><Text style={{ color: C.branco, fontSize: 10 }}>1/{item.images.length}</Text></View>}
                <View style={{ padding: 10 }}>
                  <Text style={{ color: C.roxoClaro, fontSize: 10 }}>{item.brand}</Text>
                  <Text style={{ color: C.prata, fontSize: 13, fontWeight: '700' }} numberOfLines={2}>{item.name}</Text>
                  {item.tags?.length > 0 && <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>{item.tags.slice(0,3).map((tag, i) => <Text key={i} style={{ color: C.prataEscuro, fontSize: 8, backgroundColor: C.card, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 }}>#{tag}</Text>)}</View>}
                  {item.tamanhos?.length > 0 && <Text style={{ color: C.prataEscuro, fontSize: 10, marginTop: 4 }}>Tam: {item.tamanhos.join(', ')}</Text>}
                  <Text style={{ color: C.sucesso, fontSize: 14, fontWeight: '700', marginTop: 4 }}>{item.price}</Text>
                  <TouchableOpacity style={[s.btnCarrinho, { marginTop: 8 }]} onPress={() => comprarProduto(item)}>
                    <Ionicons name="cart-outline" size={13} color={C.branco} /><Text style={{ color: C.branco, fontSize: 10, marginLeft: 3 }}>Carrinho</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <FlatList data={podePostar() ? vendasMarca : meusPedidos} keyExtractor={item => item.id}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.roxo} colors={[C.roxo]} />}
            ListEmptyComponent={<View style={{ padding: 40, alignItems: 'center' }}><Ionicons name="receipt-outline" size={60} color={C.borda} /><Text style={{ color: C.prataEscuro, marginTop: 10 }}>Nenhum pedido</Text></View>}
            renderItem={({ item }) => (
              <View style={s.pedidoCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ color: C.prata, fontWeight: '700' }}>Pedido #{item.id.slice(-6)}</Text><Text style={{ color: item.status === 'entregue' ? C.sucesso : item.status === 'cancelado' ? C.erro : C.laranja, fontWeight: '600', fontSize: 12 }}>{item.status.toUpperCase()}</Text></View>
                <Text style={{ color: C.prataEscuro, fontSize: 12, marginTop: 4 }}>{item.clienteNome} • {item.produtos?.length || 0} itens</Text>
                <Text style={{ color: C.sucesso, fontWeight: '700', marginTop: 4 }}>Total: R$ {item.total}</Text>
                {podePostar() && item.status === 'pendente' && (
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                    <TouchableOpacity style={[s.btnAcao, { backgroundColor: C.sucesso }]} onPress={() => atualizarStatusPedido(item.id, 'enviado')}><Text style={{ color: C.branco, fontSize: 11 }}>Enviado</Text></TouchableOpacity>
                    <TouchableOpacity style={[s.btnAcao, { backgroundColor: C.erro }]} onPress={() => atualizarStatusPedido(item.id, 'cancelado')}><Text style={{ color: C.branco, fontSize: 11 }}>Cancelar</Text></TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          />
        )}
      </SafeAreaView>
    );
  };

  // HOME
  const HomeScreen = () => (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 50, paddingBottom: 5 }}><Text style={{ color: C.prata, fontSize: 26, fontWeight: '900', letterSpacing: 4 }}>GRIFFERZ</Text></View>
      <FlatList data={timelinePosts} keyExtractor={item => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.roxo} colors={[C.roxo]} />}
        ListHeaderComponent={
          <View>
            {stories.length > 0 && (
              <View style={{ paddingLeft: 16, marginBottom: 15 }}>
                <ScrollView horizontal>{stories.map(story => (
                  <TouchableOpacity key={story.id} style={{ marginRight: 12, alignItems: 'center' }}>
                    <Image source={{ uri: story.marcaFoto }} style={{ width: 68, height: 68, borderRadius: 34, borderWidth: 2, borderColor: C.roxo }} />
                    <Text style={{ color: C.prataEscuro, fontSize: 9, marginTop: 4 }}>{story.marcaNome}</Text>
                  </TouchableOpacity>
                ))}</ScrollView>
              </View>
            )}
            {drops.length > 0 && (
              <View style={{ marginBottom: 15 }}>
                <ScrollView horizontal style={{ paddingLeft: 16 }}>
                  {drops.slice(0,5).map(drop => (
                    <TouchableOpacity key={drop.id} style={{ marginRight: 12, width: 130, backgroundColor: C.card, borderRadius: 12, overflow: 'hidden' }} onPress={() => setTab('drops')}>
                      <Image source={{ uri: drop.images?.[0] || drop.image }} style={{ width: 130, height: 100 }} />
                      <View style={{ padding: 8 }}><Text style={{ color: C.roxoClaro, fontSize: 9 }}>{drop.brand}</Text><Text style={{ color: C.prata, fontSize: 11 }}>{drop.name}</Text><Text style={{ color: C.sucesso, fontSize: 11, fontWeight: '700' }}>{drop.price}</Text></View>
                    </TouchableOpacity>
                  ))}</ScrollView>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, marginBottom: 8 }}>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }} onPress={() => abrirPerfilSearchz(item.marcaId)}>
                <Image source={{ uri: item.marcaFoto || 'https://picsum.photos/32' }} style={{ width: 32, height: 32, borderRadius: 16 }} />
                <Text style={{ color: C.prata, fontWeight: '700' }}>{item.marcaNome}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { if (item.marcaId === usuario?.uid || usuario?.role === 'admin') Alert.alert('Opções', '', [{ text: 'Excluir', style: 'destructive', onPress: () => handleExcluirPost(item.id) }, { text: 'Cancelar', style: 'cancel' }]); }}>
                <Ionicons name="ellipsis-horizontal" size={18} color={C.prataEscuro} />
              </TouchableOpacity>
            </View>
            {item.imagens?.length > 1 ? (
              <View>
                <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
                  {item.imagens.map((img, i) => <Image key={i} source={{ uri: img }} style={{ width, height: 450 }} />)}
                </ScrollView>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 4, gap: 6 }}>
                  {item.imagens.map((_, i) => <View key={i} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: i === 0 ? C.roxo : C.borda }} />)}
                </View>
              </View>
            ) : (
              <Image source={{ uri: item.imagens?.[0] || item.imagem || 'https://picsum.photos/400' }} style={{ width: '100%', height: 450 }} />
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10 }}>
              <View style={{ flexDirection: 'row', gap: 18 }}>
                <TouchableOpacity onPress={() => handleLike(item.id)}><Ionicons name={likedPosts[item.id] ? "heart" : "heart-outline"} size={24} color={likedPosts[item.id] ? C.erro : C.prata} /></TouchableOpacity>
                <TouchableOpacity onPress={() => abrirComentarios(item.id)}><Ionicons name="chatbubble-outline" size={22} color={C.prata} /></TouchableOpacity>
                <TouchableOpacity onPress={() => handleRepost(item.id)}><Ionicons name="repeat-outline" size={22} color={C.prata} /></TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => handleSave(item.id)}><Ionicons name={savedPosts[item.id] ? "bookmark" : "bookmark-outline"} size={22} color={savedPosts[item.id] ? C.amarelo : C.prata} /></TouchableOpacity>
            </View>
            <Text style={{ color: C.prata, fontWeight: '700', fontSize: 13, paddingHorizontal: 12 }}>{item.likes} curtidas</Text>
            <Text style={{ color: C.prataEscuro, fontSize: 13, paddingHorizontal: 12, marginTop: 2 }}>{item.desc}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );

  // HYPEZ
  const HypezScreen = () => (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 50, paddingBottom: 10 }}><Text style={{ color: C.prata, fontSize: 26, fontWeight: '900', letterSpacing: 4 }}>Hypez ⚡</Text></View>
      <FlatList data={hypezPosts} keyExtractor={item => item.id} pagingEnabled
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.roxo} colors={[C.roxo]} />}
        ListEmptyComponent={<View style={{ padding: 40, alignItems: 'center' }}><Ionicons name="play-circle-outline" size={60} color={C.borda} /><Text style={{ color: C.prataEscuro, marginTop: 10 }}>Nenhum Hypez ainda</Text></View>}
        renderItem={({ item }) => (
          <View style={{ width, height: height - 180, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={{ uri: item.imagens?.[0] || 'https://picsum.photos/400' }} style={{ width: '100%', height: '70%' }} />
            <View style={{ position: 'absolute', bottom: 100, left: 20 }}><Text style={{ color: C.branco, fontWeight: '700' }}>{item.marcaNome}</Text><Text style={{ color: C.branco }}>{item.desc}</Text></View>
            <View style={{ position: 'absolute', right: 10, bottom: 150, gap: 20 }}>
              <TouchableOpacity onPress={() => handleLike(item.id)}><Ionicons name={likedPosts[item.id] ? "heart" : "heart-outline"} size={30} color={likedPosts[item.id] ? C.erro : C.branco} /></TouchableOpacity>
              <TouchableOpacity onPress={() => abrirComentarios(item.id)}><Ionicons name="chatbubble-outline" size={30} color={C.branco} /></TouchableOpacity>
              <TouchableOpacity onPress={() => handleSave(item.id)}><Ionicons name={savedPosts[item.id] ? "bookmark" : "bookmark-outline"} size={30} color={savedPosts[item.id] ? C.amarelo : C.branco} /></TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );

  // ADMIN
  const AdminScreen = () => {
    useEffect(() => { carregarMarcasPendentes(); }, []);
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <View style={{ padding: 16, paddingTop: 50 }}><Text style={{ color: C.prata, fontSize: 24, fontWeight: '900', letterSpacing: 3 }}>Painel Admin</Text></View>
        <FlatList data={marcasPendentes} keyExtractor={item => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.roxo} colors={[C.roxo]} />}
          ListEmptyComponent={<View style={{ padding: 40, alignItems: 'center' }}><Ionicons name="checkmark-done-outline" size={60} color={C.borda} /><Text style={{ color: C.prataEscuro, marginTop: 15 }}>Nenhuma solicitação!</Text></View>}
          renderItem={({ item }) => (
            <View style={s.cardPendente}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Image source={{ uri: item.foto || 'https://picsum.photos/100' }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                <View style={{ flex: 1 }}><Text style={{ color: C.prata, fontWeight: '700' }}>{item.nome}</Text><Text style={{ color: C.prataEscuro, fontSize: 12 }}>{item.email}</Text><Text style={{ color: C.roxoClaro, fontSize: 11 }}>{item.categoria}</Text><Text style={{ color: C.prataEscuro, fontSize: 10 }}>CNPJ: {item.cnpj}</Text></View>
              </View>
              {item.documentoMarca && <TouchableOpacity style={{ marginTop: 10 }} onPress={() => Alert.alert('📄', '', [{ text: 'Ver', onPress: () => Linking.openURL(item.documentoMarca) }])}><Image source={{ uri: item.documentoMarca }} style={s.docPreview} /></TouchableOpacity>}
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                <TouchableOpacity style={[s.btnAcao, { backgroundColor: C.sucesso }]} onPress={() => aprovarMarca(item.id)}><Ionicons name="checkmark" size={18} color={C.branco} /><Text style={{ color: C.branco, marginLeft: 5 }}>Aprovar</Text></TouchableOpacity>
                <TouchableOpacity style={[s.btnAcao, { backgroundColor: C.erro }]} onPress={() => rejeitarMarca(item.id)}><Ionicons name="close" size={18} color={C.branco} /><Text style={{ color: C.branco, marginLeft: 5 }}>Rejeitar</Text></TouchableOpacity>
              </View>
            </View>
          )}
        />
        <TouchableOpacity style={[s.btnPrincipal, { margin: 16, backgroundColor: C.card, borderWidth: 1, borderColor: C.erro }]} onPress={handleLogout}><Text style={{ color: C.erro }}>Sair do Painel</Text></TouchableOpacity>
      </SafeAreaView>
    );
  };

  // PERFIL
  const ProfileScreen = () => (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.roxo} colors={[C.roxo]} />}>
          {usuario?.fotoCapa && (
            <TouchableOpacity onLongPress={selecionarFotoCapa}>
              <Image source={{ uri: usuario.fotoCapa }} style={{ width: '100%', height: 200 }} />
            </TouchableOpacity>
          )}
          {!usuario?.fotoCapa && (
            <TouchableOpacity style={{ height: 120, backgroundColor: C.card, justifyContent: 'center', alignItems: 'center' }} onPress={selecionarFotoCapa}>
              <Ionicons name="camera-outline" size={30} color={C.prataEscuro} />
              <Text style={{ color: C.prataEscuro, fontSize: 12, marginTop: 5 }}>Adicionar foto de capa</Text>
            </TouchableOpacity>
          )}
          <View style={{ alignItems: 'center', paddingHorizontal: 20, marginTop: -50 }}>
            <TouchableOpacity style={{ position: 'absolute', right: 16, top: 10 }} onPress={() => setModalMenuPerfil(true)}>
              <Ionicons name="menu" size={28} color={C.prata} />
            </TouchableOpacity>
            <Image source={{ uri: usuario?.foto || 'https://picsum.photos/200' }} style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: C.bg }} />
            <Text style={{ color: C.prata, fontSize: 22, fontWeight: '700', marginTop: 8 }}>{usuario?.nome}</Text>
            <Text style={{ color: C.prataEscuro }}>{usuario?.usuario}</Text>
            <Text style={{ color: C.roxoClaro, fontSize: 11 }}>{usuario?.tipo === 'marca_aprovada' ? '🏪 Marca' : usuario?.role === 'admin' ? '🛡️ Admin' : '👤 Cliente'}</Text>
            {usuario?.bio ? <Text style={{ color: C.prataEscuro, marginTop: 5 }}>{usuario.bio}</Text> : null}
            <View style={{ flexDirection: 'row', gap: 30, marginTop: 15 }}>
              <View style={{ alignItems: 'center' }}><Text style={{ color: C.prata, fontWeight: '700', fontSize: 18 }}>{meusPosts.length}</Text><Text style={{ color: C.prataEscuro, fontSize: 11 }}>Posts</Text></View>
              <View style={{ alignItems: 'center' }}><Text style={{ color: C.prata, fontWeight: '700', fontSize: 18 }}>{usuario?.seguidores?.length || 0}</Text><Text style={{ color: C.prataEscuro, fontSize: 11 }}>Seguidores</Text></View>
              <View style={{ alignItems: 'center' }}><Text style={{ color: C.prata, fontWeight: '700', fontSize: 18 }}>{usuario?.seguindo?.length || 0}</Text><Text style={{ color: C.prataEscuro, fontSize: 11 }}>Seguindo</Text></View>
            </View>
            {podePostar() && (
              <>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 20, width: '100%' }}>
                  {meusPosts.length === 0 ? (
                    <View style={{ width: '100%', alignItems: 'center', padding: 20 }}>
                      <Ionicons name="camera-outline" size={40} color={C.borda} /><Text style={{ color: C.prataEscuro, fontSize: 12, marginTop: 8 }}>Nenhum post ainda</Text>
                    </View>
                  ) : (
                    meusPosts.map(post => (
                      <TouchableOpacity key={post.id} style={{ width: '33.33%', padding: 1 }} onPress={() => setPostAmpliado(post)}>
                        <Image source={{ uri: post.imagens?.[0] || post.imagem || 'https://picsum.photos/200' }} style={{ width: '100%', height: 130 }} />
                      </TouchableOpacity>
                    ))
                  )}
                </View>
                <TouchableOpacity style={s.botaoFlutuante} onPress={() => setModalNovoPost(true)}><Ionicons name="add" size={30} color={C.branco} /></TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );

  // ✅ COLLABZ (TODAS as marcas)
  const CollabzScreen = () => {
    if (!podePostar()) { setTab('home'); return null; }
    if (collabChat) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 10, borderBottomWidth: 1, borderColor: C.borda }}>
            <TouchableOpacity onPress={() => setCollabChat(null)}><Ionicons name="arrow-back" size={24} color={C.prata} /></TouchableOpacity>
            <Text style={{ color: C.prata, fontSize: 18, fontWeight: '700', marginLeft: 10 }}>{collabChat.nome}</Text>
          </View>
          <FlatList data={collabMensagens} keyExtractor={item => item.id} style={{ flex: 1, paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 12, alignItems: item.senderId === usuario.uid ? 'flex-end' : 'flex-start' }}>
                <View style={{ backgroundColor: item.senderId === usuario.uid ? C.roxo : C.card, padding: 10, borderRadius: 12, maxWidth: '80%' }}>
                  <Text style={{ color: C.branco }}>{item.texto}</Text>
                </View>
                <Text style={{ color: C.prataEscuro, fontSize: 9, marginTop: 2 }}>{item.senderNome}</Text>
              </View>
            )}
          />
          <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderColor: C.borda, gap: 8 }}>
            <TextInput style={[s.input, { flex: 1, marginBottom: 0 }]} placeholder="Mensagem..." placeholderTextColor={C.prataEscuro} value={collabMensagem} onChangeText={setCollabMensagem} />
            <TouchableOpacity onPress={enviarMensagemCollab}><Ionicons name="send" size={24} color={C.roxo} /></TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <View style={{ paddingTop: 50, paddingLeft: 16 }}><Text style={{ color: C.prata, fontSize: 26, fontWeight: '900' }}>Collabz 💬</Text></View>
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 15, marginTop: 10 }}>
          <TouchableOpacity style={[s.chipFiltro, collabTab === 'marcas' && { backgroundColor: C.roxo }]} onPress={() => setCollabTab('marcas')}>
            <Text style={{ color: collabTab === 'marcas' ? C.branco : C.prataEscuro, fontWeight: '600', fontSize: 12 }}>🏪 Marcas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.chipFiltro, collabTab === 'chatz' && { backgroundColor: C.roxo }]} onPress={() => setCollabTab('chatz')}>
            <Text style={{ color: collabTab === 'chatz' ? C.branco : C.prataEscuro, fontWeight: '600', fontSize: 12 }}>💬 Chatz</Text>
          </TouchableOpacity>
        </View>
        {collabTab === 'marcas' ? (
          <FlatList
            data={collabMarcas}
            keyExtractor={item => item.id}
            ListEmptyComponent={<View style={{ padding: 40, alignItems: 'center' }}><Text style={{ color: C.prataEscuro }}>Nenhuma marca disponível</Text></View>}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: C.borda, marginHorizontal: 16, backgroundColor: C.card, borderRadius: 12, marginBottom: 8 }}>
                <Image source={{ uri: item.foto || 'https://picsum.photos/40' }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ color: C.prata, fontWeight: '700' }}>{item.nome}</Text>
                  <Text style={{ color: C.prataEscuro, fontSize: 12 }}>{item.usuario}</Text>
                </View>
                <TouchableOpacity style={{ backgroundColor: C.roxo, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }} onPress={() => setCollabChat({ id: [usuario.uid, item.id].sort().join('_'), nome: item.nome })}>
                  <Ionicons name="chatbubble-outline" size={18} color={C.branco} />
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <FlatList
            data={collabMarcas}
            keyExtractor={item => item.id}
            ListEmptyComponent={<View style={{ padding: 40, alignItems: 'center' }}><Text style={{ color: C.prataEscuro }}>Nenhuma conversa iniciada</Text></View>}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: C.borda, marginHorizontal: 16, backgroundColor: C.card, borderRadius: 12, marginBottom: 8 }}>
                <Image source={{ uri: item.foto || 'https://picsum.photos/40' }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ color: C.prata, fontWeight: '700' }}>{item.nome}</Text>
                  <Text style={{ color: C.prataEscuro, fontSize: 12 }}>{item.usuario}</Text>
                </View>
                <TouchableOpacity style={{ backgroundColor: C.roxo, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }} onPress={() => setCollabChat({ id: [usuario.uid, item.id].sort().join('_'), nome: item.nome })}>
                  <Ionicons name="chatbubble-outline" size={18} color={C.branco} />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </SafeAreaView>
    );
  };

  const screens = {
    home: <HomeScreen />, searchz: <SearchzScreen />, hypez: <HypezScreen />, drops: <DropsScreen />,
    collabz: <CollabzScreen />, admin: <AdminScreen />, profile: <ProfileScreen />,
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {screens[tab]}

      {/* Modal Post Ampliado */}
      <Modal visible={!!postAmpliado} animationType="fade" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.98)', justifyContent: 'center' }}>
          <TouchableOpacity style={{ position: 'absolute', top: 50, right: 16, zIndex: 10 }} onPress={() => { setPostAmpliado(null); setPostCarrosselIndex(0); }}><Ionicons name="close" size={28} color={C.branco} /></TouchableOpacity>
          {postAmpliado && (
            <View style={{ width: '100%' }}>
              {postAmpliado.imagens?.length > 1 ? (
                <View>
                  <FlatList data={postAmpliado.imagens} horizontal pagingEnabled showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    onMomentumScrollEnd={(e) => { setPostCarrosselIndex(Math.round(e.nativeEvent.contentOffset.x / width)); }}
                    renderItem={({ item }) => <Image source={{ uri: item }} style={{ width, height: 450 }} />}
                  />
                  <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8, gap: 6 }}>
                    {postAmpliado.imagens.map((_, i) => <View key={i} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: i === postCarrosselIndex ? C.roxo : C.borda }} />)}
                  </View>
                </View>
              ) : (
                <Image source={{ uri: postAmpliado.imagens?.[0] || postAmpliado.imagem || 'https://picsum.photos/400' }} style={{ width: '100%', height: 450 }} />
              )}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
                <View style={{ flexDirection: 'row', gap: 20 }}>
                  <TouchableOpacity onPress={() => handleLike(postAmpliado.id)}><Ionicons name={likedPosts[postAmpliado.id] ? "heart" : "heart-outline"} size={28} color={likedPosts[postAmpliado.id] ? C.erro : C.branco} /></TouchableOpacity>
                  <TouchableOpacity onPress={() => { setPostAmpliado(null); abrirComentarios(postAmpliado.id); }}><Ionicons name="chatbubble-outline" size={26} color={C.branco} /></TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRepost(postAmpliado.id)}><Ionicons name="repeat-outline" size={26} color={C.branco} /></TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => handleSave(postAmpliado.id)}><Ionicons name={savedPosts[postAmpliado.id] ? "bookmark" : "bookmark-outline"} size={26} color={savedPosts[postAmpliado.id] ? C.amarelo : C.branco} /></TouchableOpacity>
              </View>
              <Text style={{ color: C.branco, fontWeight: '700', fontSize: 14, paddingHorizontal: 16 }}>{postAmpliado.likes || 0} curtidas</Text>
              <Text style={{ color: C.prataEscuro, fontSize: 13, paddingHorizontal: 16, marginTop: 4 }}>{postAmpliado.desc || postAmpliado.name}</Text>
              {postAmpliado.price && <Text style={{ color: C.sucesso, fontWeight: '700', fontSize: 16, paddingHorizontal: 16, marginTop: 4 }}>{postAmpliado.price}</Text>}
              {postAmpliado.tags && <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, paddingHorizontal: 16, marginTop: 6 }}>{postAmpliado.tags.map((tag, i) => <Text key={i} style={{ color: C.roxoClaro, fontSize: 10, backgroundColor: C.card, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>#{tag}</Text>)}</View>}
              {postAmpliado.tamanhos && <Text style={{ color: C.prataEscuro, fontSize: 12, paddingHorizontal: 16, marginTop: 4 }}>Tamanhos: {postAmpliado.tamanhos.join(', ')}</Text>}
              <Text style={{ color: C.prataEscuro, fontSize: 10, paddingHorizontal: 16, marginTop: 4 }}>{postAmpliado.data || 'Disponível'}</Text>
            </View>
          )}
        </View>
      </Modal>

      {/* Modal Carrinho */}
      <Modal visible={modalCarrinho} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: C.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}><Text style={{ color: C.prata, fontSize: 18, fontWeight: '700' }}>🛒 Carrinho</Text><TouchableOpacity onPress={() => setModalCarrinho(false)}><Ionicons name="close" size={24} color={C.prata} /></TouchableOpacity></View>
            {carrinho.length === 0 ? <Text style={{ color: C.prataEscuro, textAlign: 'center', padding: 30 }}>Carrinho vazio</Text> : (
              <>
                <ScrollView style={{ maxHeight: 300 }}>{carrinho.map(item => (
                  <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 }}>
                    <Image source={{ uri: item.images?.[0] || item.image }} style={{ width: 50, height: 50, borderRadius: 8 }} />
                    <View style={{ flex: 1 }}><Text style={{ color: C.prata, fontWeight: '600' }}>{item.name}</Text><Text style={{ color: C.prataEscuro, fontSize: 11 }}>{item.brand}</Text><Text style={{ color: C.sucesso, fontSize: 12, fontWeight: '700' }}>{item.price}</Text></View>
                    <TouchableOpacity onPress={() => removerDoCarrinho(item.id)}><Ionicons name="trash-outline" size={18} color={C.erro} /></TouchableOpacity>
                  </View>
                ))}</ScrollView>
                <View style={{ borderTopWidth: 1, borderColor: C.borda, paddingTop: 12, marginTop: 10 }}>
                  <Text style={{ color: C.prata, fontWeight: '700', fontSize: 16 }}>Total: R$ {totalCarrinho.toFixed(2)}</Text>
                  <TouchableOpacity style={[s.btnPrincipal, { marginTop: 10 }]} onPress={() => { setModalCarrinho(false); setModalCheckout(true); }}><Text style={{ color: C.branco, fontWeight: '700' }}>Finalizar Pedido</Text></TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal Checkout */}
      <Modal visible={modalCheckout} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: C.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}><Text style={{ color: C.prata, fontSize: 18, fontWeight: '700' }}>📦 Checkout</Text><TouchableOpacity onPress={() => setModalCheckout(false)}><Ionicons name="close" size={24} color={C.prata} /></TouchableOpacity></View>
            <TextInput style={s.input} placeholder="Endereço completo" placeholderTextColor={C.prataEscuro} value={enderecoEntrega} onChangeText={setEnderecoEntrega} multiline />
            <Text style={{ color: C.prata, fontWeight: '700', fontSize: 16, marginBottom: 10 }}>Total: R$ {totalCarrinho.toFixed(2)}</Text>
            <TouchableOpacity style={s.btnPrincipal} onPress={() => setModalPagamento(true)}><Text style={{ color: C.branco, fontWeight: '700' }}>💳 Pagar com PagSeguro</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Pagamento */}
      <Modal visible={modalPagamento} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: C.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}><Text style={{ color: C.prata, fontSize: 18, fontWeight: '700' }}>PagSeguro</Text><TouchableOpacity onPress={() => setModalPagamento(false)}><Ionicons name="close" size={24} color={C.prata} /></TouchableOpacity></View>
            <Text style={{ color: C.prataEscuro, marginBottom: 20 }}>Você será redirecionado para concluir o pagamento.</Text>
            <TouchableOpacity style={s.btnPrincipal} onPress={processarPagamento}><Text style={{ color: C.branco, fontWeight: '700' }}>Ir para PagSeguro</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Novo Produto */}
      <Modal visible={modalNovoProduto} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: C.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                <Text style={{ color: C.prata, fontSize: 18, fontWeight: '700' }}>Novo Produto</Text>
                <TouchableOpacity onPress={() => { setModalNovoProduto(false); setProdutoImagens([]); setProdutoVideos([]); setProdutoDescricao(''); setProdutoTags(''); setProdutoTamanhos([]); }}>
                  <Ionicons name="close" size={24} color={C.prata} />
                </TouchableOpacity>
              </View>
              <TextInput style={s.input} placeholder="Nome *" placeholderTextColor={C.prataEscuro} value={novoProdutoNome} onChangeText={setNovoProdutoNome} />
              <TextInput style={s.input} placeholder="Preço (ex: 199,90) *" placeholderTextColor={C.prataEscuro} value={novoProdutoPreco} onChangeText={setNovoProdutoPreco} keyboardType="decimal-pad" />
              <TextInput style={[s.input, { height: 80 }]} placeholder="Descrição" placeholderTextColor={C.prataEscuro} value={produtoDescricao} onChangeText={setProdutoDescricao} multiline />
              <TextInput style={s.input} placeholder="Tags (ex: calça, baggy)" placeholderTextColor={C.prataEscuro} value={produtoTags} onChangeText={setProdutoTags} />
              <Text style={{ color: C.prataEscuro, fontSize: 12, marginBottom: 8 }}>Tamanhos:</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                {TAMANHOS.map(tam => (
                  <TouchableOpacity key={tam} style={[s.tamanhoBtn, produtoTamanhos.includes(tam) && { backgroundColor: C.roxo }]} onPress={() => toggleTamanho(tam)}>
                    <Text style={{ color: produtoTamanhos.includes(tam) ? C.branco : C.prataEscuro, fontSize: 13, fontWeight: '600' }}>{tam}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={{ color: C.prataEscuro, fontSize: 12, marginBottom: 8 }}>Imagens (máx. 10) *</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                {produtoImagens.map((uri, i) => (
                  <View key={i} style={{ position: 'relative' }}>
                    <Image source={{ uri }} style={{ width: 70, height: 70, borderRadius: 8 }} />
                    <TouchableOpacity style={{ position: 'absolute', top: -5, right: -5, backgroundColor: C.erro, borderRadius: 10, width: 20, height: 20 }} onPress={() => removerImagemProduto(i)}><Ionicons name="close" size={12} color={C.branco} /></TouchableOpacity>
                  </View>
                ))}
                {produtoImagens.length < 10 && (
                  <TouchableOpacity style={{ width: 70, height: 70, borderRadius: 8, borderWidth: 2, borderColor: C.roxo, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' }} onPress={selecionarImagensProduto}><Ionicons name="add" size={24} color={C.roxo} /></TouchableOpacity>
                )}
              </View>
              <Text style={{ color: C.prataEscuro, fontSize: 12, marginBottom: 8 }}>Vídeos (máx. 2)</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 }}>
                {produtoVideos.map((uri, i) => (
                  <View key={i} style={{ position: 'relative' }}>
                    <View style={{ width: 70, height: 70, borderRadius: 8, backgroundColor: C.card, justifyContent: 'center', alignItems: 'center' }}><Ionicons name="play" size={20} color={C.roxo} /></View>
                    <TouchableOpacity style={{ position: 'absolute', top: -5, right: -5, backgroundColor: C.erro, borderRadius: 10, width: 20, height: 20 }} onPress={() => removerVideoProduto(i)}><Ionicons name="close" size={12} color={C.branco} /></TouchableOpacity>
                  </View>
                ))}
                {produtoVideos.length < 2 && (
                  <TouchableOpacity style={{ width: 70, height: 70, borderRadius: 8, borderWidth: 2, borderColor: C.roxo, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' }} onPress={selecionarVideosProduto}><Ionicons name="add" size={24} color={C.roxo} /></TouchableOpacity>
                )}
              </View>
              <TouchableOpacity style={s.btnPrincipal} onPress={adicionarProduto}><Text style={{ color: C.branco, fontWeight: '700' }}>➕ Publicar</Text></TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Editar Perfil */}
      <Modal visible={modalEditarPerfil} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: C.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
            <ScrollView>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                <Text style={{ color: C.prata, fontSize: 18, fontWeight: '700' }}>Editar Perfil</Text>
                <TouchableOpacity onPress={() => setModalEditarPerfil(false)}><Ionicons name="close" size={24} color={C.prata} /></TouchableOpacity>
              </View>
              <TouchableOpacity onPress={selecionarFotoPerfil} style={{ alignItems: 'center', marginBottom: 15 }}>
                <Image source={{ uri: editFoto || usuario?.foto || 'https://picsum.photos/200' }} style={{ width: 80, height: 80, borderRadius: 40 }} />
                <Text style={{ color: C.roxoClaro, marginTop: 5 }}>Alterar foto</Text>
              </TouchableOpacity>
              <TextInput style={s.input} placeholder="Nome" placeholderTextColor={C.prataEscuro} value={editNome} onChangeText={setEditNome} />
              <TextInput style={s.input} placeholder="Bio" placeholderTextColor={C.prataEscuro} value={editBio} onChangeText={setEditBio} multiline />
              {podePostar() && <TextInput style={s.input} placeholder="Categoria" placeholderTextColor={C.prataEscuro} value={editCategoria} onChangeText={setEditCategoria} />}
              <TouchableOpacity style={s.btnPrincipal} onPress={handleEditarPerfil}><Text style={{ color: C.branco, fontWeight: '700' }}>💾 Salvar</Text></TouchableOpacity>
              <TouchableOpacity style={[s.btnPrincipal, { backgroundColor: C.erro, marginTop: 20 }]} onPress={() => { setModalEditarPerfil(false); handleExcluirConta(); }}>
                <Text style={{ color: C.branco, fontWeight: '700' }}>⚠️ Excluir Conta</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Menu Perfil com SAIR */}
      <Modal visible={modalMenuPerfil} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: C.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              <Text style={{ color: C.prata, fontSize: 18, fontWeight: '700' }}>Opções</Text>
              <TouchableOpacity onPress={() => setModalMenuPerfil(false)}><Ionicons name="close" size={24} color={C.prata} /></TouchableOpacity>
            </View>
            <TouchableOpacity style={[s.btnPrincipal, { marginBottom: 10 }]} onPress={() => { setModalMenuPerfil(false); abrirEditarPerfil(); }}>
              <Text style={{ color: C.branco, fontWeight: '700' }}>✏️ Editar Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.btnPrincipal, { marginBottom: 10, backgroundColor: C.card, borderWidth: 1, borderColor: C.erro }]} onPress={() => { setModalMenuPerfil(false); handleLogout(); }}>
              <Text style={{ color: C.erro, fontWeight: '700' }}>🚪 Sair da Conta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.btnPrincipal, { backgroundColor: C.erro, marginTop: 10 }]} onPress={() => { setModalMenuPerfil(false); handleExcluirConta(); }}>
              <Text style={{ color: C.branco, fontWeight: '700' }}>⚠️ Excluir Conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Novo Post */}
      <Modal visible={modalNovoPost} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: C.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}><Text style={{ color: C.prata, fontSize: 18, fontWeight: '700' }}>{etapaPost === 1 ? 'Novo Post' : 'Detalhes'}</Text><TouchableOpacity onPress={limparFormPost}><Ionicons name="close" size={24} color={C.prata} /></TouchableOpacity></View>
            {etapaPost === 1 ? (
              <View>
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
                  <TouchableOpacity style={[s.tipoPostBtn, tipoPost === 'normal' && { backgroundColor: C.roxo }]} onPress={() => setTipoPost('normal')}><Ionicons name="grid-outline" size={20} color={tipoPost === 'normal' ? C.branco : C.prataEscuro} /><Text style={{ color: tipoPost === 'normal' ? C.branco : C.prataEscuro, marginLeft: 5 }}>Post</Text></TouchableOpacity>
                  <TouchableOpacity style={[s.tipoPostBtn, tipoPost === 'hypez' && { backgroundColor: C.roxo }]} onPress={() => setTipoPost('hypez')}><Ionicons name="play-circle-outline" size={20} color={tipoPost === 'hypez' ? C.branco : C.prataEscuro} /><Text style={{ color: tipoPost === 'hypez' ? C.branco : C.prataEscuro, marginLeft: 5 }}>Hypez</Text></TouchableOpacity>
                </View>
                {tipoPost === 'normal' ? <TouchableOpacity style={s.btnUpload} onPress={selecionarImagens}><Ionicons name="images-outline" size={40} color={C.roxo} /><Text style={{ color: C.prata, marginTop: 10 }}>Selecionar até 10 fotos</Text></TouchableOpacity> : <TouchableOpacity style={s.btnUpload} onPress={selecionarVideo}><Ionicons name="videocam-outline" size={40} color={C.roxo} /><Text style={{ color: C.prata, marginTop: 10 }}>Selecionar vídeo</Text></TouchableOpacity>}
                {imagensSelecionadas.length > 0 && <View style={{ marginTop: 15 }}><ScrollView horizontal>{imagensSelecionadas.map((uri, i) => <TouchableOpacity key={i} onPress={() => abrirEditorImagem(uri)}><Image source={{ uri }} style={{ width: 80, height: 80, borderRadius: 8, marginRight: 8 }} /></TouchableOpacity>)}</ScrollView></View>}
                <TouchableOpacity style={[s.btnPrincipal, { marginTop: 20 }]} onPress={avancarEtapa}><Text style={{ color: C.branco, fontWeight: '700' }}>Avançar</Text></TouchableOpacity>
              </View>
            ) : (
              <View>
                <TextInput style={s.input} placeholder="Legenda" placeholderTextColor={C.prataEscuro} value={legendaPost} onChangeText={setLegendaPost} multiline />
                <TextInput style={s.input} placeholder="@ Mencionar" placeholderTextColor={C.prataEscuro} value={mencaoPost} onChangeText={setMencaoPost} />
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                  <TouchableOpacity style={[s.btnPrincipal, { flex: 1, backgroundColor: C.card, borderWidth: 1 }]} onPress={() => setEtapaPost(1)}><Text style={{ color: C.prata }}>Voltar</Text></TouchableOpacity>
                  <TouchableOpacity style={[s.btnPrincipal, { flex: 1 }]} onPress={publicarPost}><Text style={{ color: C.branco, fontWeight: '700' }}>Publicar</Text></TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal Editar Imagem */}
      <Modal visible={!!modalEditarImagem} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.98)', justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: C.card, borderRadius: 16, padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}><Text style={{ color: C.prata, fontSize: 18, fontWeight: '700' }}>Editar</Text><TouchableOpacity onPress={() => { setModalEditarImagem(false); setEditandoImagem(null); }}><Ionicons name="close" size={24} color={C.prata} /></TouchableOpacity></View>
            {editandoImagem && <Image source={{ uri: editandoImagem }} style={{ width: '100%', height: 300, borderRadius: 8, marginBottom: 15 }} />}
            <TouchableOpacity style={s.btnEditar} onPress={() => aplicarEdicaoImagem('cortar', 600)}><Ionicons name="crop" size={20} color={C.prata} /><Text style={{ color: C.prata, marginLeft: 10 }}>Cortar</Text></TouchableOpacity>
            <TouchableOpacity style={s.btnEditar} onPress={() => aplicarEdicaoImagem('redimensionar', 1080)}><Ionicons name="resize" size={20} color={C.prata} /><Text style={{ color: C.prata, marginLeft: 10 }}>Redimensionar</Text></TouchableOpacity>
            <TouchableOpacity style={s.btnEditar} onPress={() => aplicarEdicaoImagem('rotacionar', 90)}><Ionicons name="refresh" size={20} color={C.prata} /><Text style={{ color: C.prata, marginLeft: 10 }}>Rotacionar</Text></TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
              <TouchableOpacity style={[s.btnPrincipal, { flex: 1, backgroundColor: C.card, borderWidth: 1 }]} onPress={() => { setModalEditarImagem(false); setEditandoImagem(null); }}><Text style={{ color: C.prata }}>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity style={[s.btnPrincipal, { flex: 1 }]} onPress={salvarEdicao}><Text style={{ color: C.branco, fontWeight: '700' }}>Salvar</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Comentários */}
      <Modal visible={!!modalComentarios} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: C.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '70%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}><Text style={{ color: C.prata, fontSize: 16, fontWeight: '700' }}>Comentários</Text><TouchableOpacity onPress={() => setModalComentarios(null)}><Ionicons name="close" size={24} color={C.prata} /></TouchableOpacity></View>
            <ScrollView style={{ maxHeight: 300 }}>{modalComentarios && (timelinePosts.find(p => p.id === modalComentarios)?.comments || []).map((c, i) => <View key={i} style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}><View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: C.roxo, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: C.branco, fontWeight: '700' }}>{c.autor?.[0]?.toUpperCase()}</Text></View><View><Text style={{ color: C.prata, fontWeight: '600', fontSize: 12 }}>{c.autor}</Text><Text style={{ color: C.prataEscuro, fontSize: 13 }}>{c.texto}</Text></View></View>)}</ScrollView>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              <TextInput style={[s.input, { flex: 1 }]} placeholder="Comentário..." placeholderTextColor={C.prataEscuro} value={comentarioTexto} onChangeText={setComentarioTexto} />
              <TouchableOpacity onPress={enviarComentario}><Ionicons name="send" size={24} color={C.roxo} /></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: C.borda, paddingBottom: 30, paddingTop: 10 }}>
        {tabsFinal.map(t => (
          <TouchableOpacity key={t.key} style={{ flex: 1, alignItems: 'center' }} onPress={() => { setTab(t.key); setPerfilVisitado(null); setSearchzPerfil(null); }}>
            <Ionicons name={tab === t.key ? t.icon : `${t.icon}-outline`} size={22} color={tab === t.key ? C.prata : C.prataEscuro} />
            <Text style={{ color: tab === t.key ? C.prata : C.prataEscuro, fontSize: 9 }}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  modoBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 25 },
  modoBtnAtivo: { backgroundColor: '#7b2ff7' },
  tipoCard: { width: 120, padding: 15, alignItems: 'center', borderRadius: 15, borderWidth: 2, borderColor: '#1a1a1a', backgroundColor: '#0a0a0a' },
  erroBox: { backgroundColor: 'rgba(255,45,85,0.1)', padding: 12, borderRadius: 10, marginBottom: 15 },
  input: { backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#1a1a1a', fontSize: 14 },
  btnPrincipal: { backgroundColor: '#7b2ff7', padding: 16, borderRadius: 25, alignItems: 'center', marginTop: 10 },
  btnEditarPerfil: { marginTop: 15, borderWidth: 1, borderColor: '#1a1a1a', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  botaoFlutuante: { position: 'absolute', bottom: 20, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#7b2ff7', justifyContent: 'center', alignItems: 'center', elevation: 8 },
  btnUpload: { borderWidth: 2, borderColor: '#7b2ff7', borderStyle: 'dashed', borderRadius: 15, padding: 30, alignItems: 'center' },
  tipoPostBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: C.card, borderWidth: 1, borderColor: C.borda },
  btnEditar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', padding: 14, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: C.borda },
  btnUploadDoc: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', padding: 14, borderRadius: 12, marginTop: 10, borderWidth: 1, borderColor: '#333' },
  cardPendente: { backgroundColor: '#111111', marginHorizontal: 16, marginBottom: 12, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#1a1a1a' },
  docPreview: { width: '100%', height: 120, borderRadius: 8, borderWidth: 1, borderColor: '#333' },
  btnAcao: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 20 },
  produtoCard: { flex: 1, backgroundColor: '#111111', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#1a1a1a', marginBottom: 12 },
  btnCarrinho: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#7b2ff7', borderRadius: 20, paddingVertical: 8 },
  pedidoCard: { backgroundColor: '#111111', marginHorizontal: 16, marginBottom: 12, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#1a1a1a' },
  metodoBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 2, borderColor: '#1a1a1a' },
  chipFiltro: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: C.card, marginRight: 8, borderWidth: 1, borderColor: C.borda },
  pagamentoBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 2, borderColor: C.borda },
  tamanhoBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: C.borda, backgroundColor: C.card },
});