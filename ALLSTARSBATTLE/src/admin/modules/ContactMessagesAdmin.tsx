import React, { useState, useEffect, useRef } from 'react';
import { Mail, Eye, EyeOff, Trash2, MessageSquare, User, Calendar, CheckCircle, Clock, FileText, Filter } from 'lucide-react';
import api from '../../services/api';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  source?: 'website' | 'danseurs' | 'professionnels' | 'benevoles' | 'sponsors' | 'admin';
  read_at?: string;
  created_at: string;
  updated_at: string;
}

export default function ContactMessagesAdmin() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [newMessageMode, setNewMessageMode] = useState(false);
  const [newRecipientEmail, setNewRecipientEmail] = useState('');
  const [newMessageSubject, setNewMessageSubject] = useState('');
  const [newMessageBody, setNewMessageBody] = useState('');
  const [newMessageSource, setNewMessageSource] = useState<'danseurs' | 'professionnels' | 'benevoles' | 'sponsors' | 'admin'>('admin');
  const [newMessageStatus, setNewMessageStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [replySending, setReplySending] = useState(false);
  const [replyStatus, setReplyStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const replyFormRef = useRef<HTMLDivElement>(null);

  // États pour la vue récapitulative
  const [summaryView, setSummaryView] = useState(false);
  const [summarySourceFilter, setSummarySourceFilter] = useState<'all' | 'website' | 'danseurs' | 'professionnels' | 'benevoles' | 'sponsors' | 'admin'>('all');
  const [summaryCurrentPage, setSummaryCurrentPage] = useState(1);
  const summaryPageSize = 10;

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cms/contact-messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading contact messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/cms/contact-messages/${id}/read`);
      await loadMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const markAsReplied = async (id: number) => {
    try {
      await api.put(`/cms/contact-messages/${id}/replied`);
      await loadMessages();
    } catch (error) {
      console.error('Error marking message as replied:', error);
    }
  };

  const openReplyToMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setReplySubject(`Réponse à : ${message.subject || 'votre demande'}`);
    setReplyMessage(`Bonjour ${message.name},\n\nMerci pour votre message${message.subject ? ` concernant "${message.subject}"` : ''}.\n\n`);

    setTimeout(() => {
      replyFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const sendReply = async () => {
    if (!selectedMessage) return;

    if (!replyMessage.trim()) {
      setReplyStatus('error');
      return;
    }

    const defaultSubject = selectedMessage.subject
      ? `Réponse à : ${selectedMessage.subject}`
      : 'Réponse de All Stars Battle International';

    try {
      setReplySending(true);
      setReplyStatus('sending');

      await api.post(`/cms/contact-messages/${selectedMessage.id}/reply`, {
        reply_subject: replySubject || defaultSubject,
        reply_message: replyMessage,
      });

      setReplyStatus('sent');
      setReplyMessage('');
      setReplySubject('');
      await loadMessages();
    } catch (error) {
      console.error('Error sending reply:', error);
      setReplyStatus('error');
    } finally {
      setReplySending(false);
    }
  };


  const deleteMessage = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;

    try {
      await api.delete(`/cms/contact-messages/${id}`);
      await loadMessages();
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const sendNewMessage = async () => {
    if (!newRecipientEmail.trim() || !newMessageSubject.trim() || !newMessageBody.trim()) {
      setNewMessageStatus('error');
      return;
    }
    try {
      setNewMessageStatus('sending');
      await api.post('/cms/contact-messages/send', {
        email: newRecipientEmail,
        subject: newMessageSubject,
        message: newMessageBody,
        source: newMessageSource,
      });
      setNewMessageStatus('sent');
      setNewRecipientEmail('');
      setNewMessageSubject('');
      setNewMessageBody('');
      await loadMessages();
    } catch (error) {
      console.error('Error sending new message:', error);
      setNewMessageStatus('error');
    }
  };

  const cancelReply = () => {
    setSelectedMessage(null);
    setReplySubject('');
    setReplyMessage('');
    setReplyStatus('idle');
  };

  const cancelNewMessage = () => {
    setNewMessageMode(false);
    setNewRecipientEmail('');
    setNewMessageSubject('');
    setNewMessageBody('');
    setNewMessageStatus('idle');
  };

  const toggleSummaryView = () => {
    setSummaryView(!summaryView);
    setSummaryCurrentPage(1);
    setSummarySourceFilter('all');
    if (!summaryView) {
      setSelectedMessage(null);
      setNewMessageMode(false);
    }
  };

  const goToMessageDetail = (message: ContactMessage) => {
    setSelectedMessage(message);
    setSummaryView(false);
    setNewMessageMode(false);
    setReplySubject(`Réponse à : ${message.subject || 'votre demande'}`);
    setReplyMessage(`Bonjour ${message.name},\n\nMerci pour votre message${message.subject ? ` concernant "${message.subject}"` : ''}.\n\n`);
    
    // Scroller vers le formulaire de réponse
    setTimeout(() => {
      replyFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Données pour la vue récapitulative (messages non lus uniquement)
  const unreadMessages = messages.filter(m => m.status === 'unread');
  const filteredSummaryMessages = summarySourceFilter === 'all' 
    ? unreadMessages 
    : unreadMessages.filter(m => m.source === summarySourceFilter);
  const summaryTotalPages = Math.max(1, Math.ceil(filteredSummaryMessages.length / summaryPageSize));
  const summaryPaginatedMessages = filteredSummaryMessages.slice(
    (summaryCurrentPage - 1) * summaryPageSize, 
    summaryCurrentPage * summaryPageSize
  );

  const unreadCount = messages.filter(m => m.status === 'unread').length;
  const waitingCount = unreadCount; // affichage attendu : non lus

  const filteredMessages = messages.filter(message => {
    if (filter === 'all') return true;
    if (filter === 'pending') return message.status !== 'replied';
    return message.status === filter;
  });

  const totalPages = Math.max(1, Math.ceil(filteredMessages.length / pageSize));
  const paginatedMessages = filteredMessages.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread':
        return <Mail className="w-4 h-4 text-blue-400" />;
      case 'read':
        return <Eye className="w-4 h-4 text-green-400" />;
      case 'replied':
        return <CheckCircle className="w-4 h-4 text-purple-400" />;
      default:
        return <Mail className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'unread':
        return 'Non lu';
      case 'read':
        return 'Lu';
      case 'replied':
        return 'Répondu';
      default:
        return status;
    }
  };

  const getSourceLabel = (source?: string) => {
    switch (source) {
      case 'danseurs':
        return 'Danseur';
      case 'professionnels':
        return 'Professionnel';
      case 'benevoles':
        return 'Bénévole';
      case 'sponsors':
        return 'Partenaire/Sponsor';
      case 'admin':
        return 'Admin';
      default:
        return 'Site web';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-heading text-primary">Messages de Contact</h2>
        <button
          onClick={toggleSummaryView}
          className={`ml-auto px-4 py-2 rounded-lg border transition-colors ${
            summaryView 
              ? 'bg-primary text-white border-primary' 
              : 'bg-surface-dark text-gray-300 border-gray-700 hover:bg-gray-700'
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Récapitulatif
        </button>
        <button
          onClick={() => setNewMessageMode((prev) => !prev)}
          className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
        >
          Nouveau Message
        </button>
        <div className="flex items-center gap-2 bg-surface-dark border border-gray-700 rounded-full px-3 py-1">
          <Mail className="w-4 h-4 text-cyan-300" />
          <span className="text-sm text-gray-300"></span>
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-bold">{waitingCount}</span>
        </div>
      </div>

      {summaryView ? (
        // Vue Récapitulative
        <div className="space-y-6">
          <div className="bg-surface-dark border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Récapitulatif des messages non lus</h3>
            
            {/* Filtres par source */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { key: 'all', label: 'Tous', count: unreadMessages.length },
                { key: 'website', label: 'Site web', count: unreadMessages.filter(m => m.source === 'website' || !m.source).length },
                { key: 'danseurs', label: 'Danseurs', count: unreadMessages.filter(m => m.source === 'danseurs').length },
                { key: 'professionnels', label: 'Professionnels', count: unreadMessages.filter(m => m.source === 'professionnels').length },
                { key: 'benevoles', label: 'Bénévoles', count: unreadMessages.filter(m => m.source === 'benevoles').length },
                { key: 'sponsors', label: 'Sponsors', count: unreadMessages.filter(m => m.source === 'sponsors').length },
                { key: 'admin', label: 'Admin', count: unreadMessages.filter(m => m.source === 'admin').length },
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => {
                    setSummarySourceFilter(key as any);
                    setSummaryCurrentPage(1);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    summarySourceFilter === key
                      ? 'bg-primary text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>

            {/* Tableau récapitulatif */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">Nom</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">Date</th>
                    <th className="text-center py-3 px-4 text-gray-300 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryPaginatedMessages.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-400">
                        Aucun message non lu trouvé
                      </td>
                    </tr>
                  ) : (
                    summaryPaginatedMessages.map((message) => (
                      <tr key={message.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="py-3 px-4 text-white font-medium">{message.name}</td>
                        <td className="py-3 px-4 text-gray-300">{message.email}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded text-xs font-medium bg-amber-500/20 text-amber-300">
                            {getSourceLabel(message.source)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-400 text-sm">
                          {formatDate(message.created_at)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => goToMessageDetail(message)}
                            className="p-2 text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg transition-colors"
                            title="Voir le message"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination pour la vue récapitulative */}
            {summaryTotalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-400">
                  Page {summaryCurrentPage} sur {summaryTotalPages} ({filteredSummaryMessages.length} messages)
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={summaryCurrentPage <= 1}
                    onClick={() => setSummaryCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-2 rounded bg-surface-dark border border-gray-700 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                  >
                    Précédent
                  </button>
                  <button
                    disabled={summaryCurrentPage >= summaryTotalPages}
                    onClick={() => setSummaryCurrentPage((p) => Math.min(summaryTotalPages, p + 1))}
                    className="px-3 py-2 rounded bg-surface-dark border border-gray-700 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Vue normale (existante)
        <>
        {newMessageMode && (
        <div className="bg-surface-dark border border-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Envoyer un nouveau message</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              value={newRecipientEmail}
              onChange={(e) => setNewRecipientEmail(e.target.value)}
              placeholder="Email du destinataire"
              className="rounded-lg border border-gray-600 bg-surface-dark px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
            />
            <input
              value={newMessageSubject}
              onChange={(e) => setNewMessageSubject(e.target.value)}
              placeholder="Sujet"
              className="rounded-lg border border-gray-600 bg-surface-dark px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
            />
            <select
              value={newMessageSource}
              onChange={(e) => setNewMessageSource(e.target.value as any)}
              className="rounded-lg border border-gray-600 bg-surface-dark px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
            >
              <option value="danseurs">Danseurs</option>
              <option value="professionnels">Professionnels</option>
              <option value="benevoles">Bénévoles</option>
              <option value="sponsors">Partenaires / Sponsors</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <textarea
            value={newMessageBody}
            onChange={(e) => setNewMessageBody(e.target.value)}
            placeholder="Votre message"
            rows={4}
            className="w-full mt-3 rounded-lg border border-gray-600 bg-surface-dark px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
          />
          {newMessageStatus === 'sent' && <p className="text-sm text-green-400 mt-2">Message envoyé avec succès.</p>}
          {newMessageStatus === 'error' && <p className="text-sm text-red-400 mt-2">Erreur d'envoi : tous les champs sont requis.</p>}
          <div className="mt-3 flex gap-2">
            <button
              onClick={sendNewMessage}
              disabled={newMessageStatus === 'sending'}
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-indigo-600 disabled:opacity-50"
            >
              {newMessageStatus === 'sending' ? 'Envoi...' : 'Envoyer le message'}
            </button>
            <button
              onClick={cancelNewMessage}
              className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
            >
              Annuler
            </button>
          </div>
        </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-surface-dark border border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-300">Total</span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{messages.length}</p>
        </div>
        <div className="bg-surface-dark border border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-300">Non lus</span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {messages.filter(m => m.status === 'unread').length}
          </p>
        </div>
        <div className="bg-surface-dark border border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-300">Lus</span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {messages.filter(m => m.status === 'read').length}
          </p>
        </div>
        <div className="bg-surface-dark border border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-gray-300">En attente</span>
            <span className="ml-1 inline-flex min-w-[24px] h-6 items-center justify-center rounded-full bg-rose-500 text-white text-xs font-semibold">
              {waitingCount}
            </span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {waitingCount}
          </p>
        </div>
        <div className="bg-surface-dark border border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-300">Répondus</span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {messages.filter(m => m.status === 'replied').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'all', label: 'Tous', count: messages.length },
          { key: 'pending', label: 'En attente', count: waitingCount },
          { key: 'unread', label: 'Non lus', count: messages.filter(m => m.status === 'unread').length },
          { key: 'read', label: 'Lus', count: messages.filter(m => m.status === 'read').length },
          { key: 'replied', label: 'Répondus', count: messages.filter(m => m.status === 'replied').length },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => {
              setFilter(key as any);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-primary text-white'
                : 'bg-surface-dark text-gray-300 hover:bg-gray-700'
            }`}
          >
            {key === 'pending' ? <span className="inline-flex items-center gap-1"><Mail className="w-4 h-4" />{label}<sup className="ml-1 text-xs text-amber-300">{count}</sup></span> : <>{label}</>}
            <span className="ml-1">({count})</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Messages</h3>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span>Page {currentPage}/{totalPages}</span>
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2 py-1 rounded bg-surface-dark border border-gray-700 hover:bg-gray-700 disabled:opacity-40"
              >Précédent</button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2 py-1 rounded bg-surface-dark border border-gray-700 hover:bg-gray-700 disabled:opacity-40"
              >Suivant</button>
            </div>
          </div>

          {filteredMessages.length === 0 ? (
            <div className="bg-surface-dark border border-gray-700 rounded-lg p-8 text-center">
              <Mail className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Aucun message trouvé</p>
            </div>
          ) : (
            paginatedMessages.map((message) => (
              <div
                key={message.id}
                className={`bg-surface-dark border rounded-lg p-4 cursor-pointer transition-all hover:border-primary/50 ${
                  selectedMessage?.id === message.id ? 'border-primary' : 'border-gray-700'
                } ${message.status === 'unread' ? 'bg-blue-900/10 border-blue-500/30' : ''}`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(message.status)}
                    <span className="font-medium text-white">{message.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatDate(message.created_at)}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-1">{message.email} • <span className="font-semibold text-amber-300">{getSourceLabel(message.source)}</span></p>
                {message.subject && (
                  <p className="text-sm font-medium text-primary mb-2">{message.subject}</p>
                )}
                <p className="text-sm text-gray-400 line-clamp-2">{message.message}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-xs px-2 py-1 rounded ${
                    message.status === 'unread' ? 'bg-blue-500/20 text-blue-300' :
                    message.status === 'read' ? 'bg-green-500/20 text-green-300' :
                    'bg-purple-500/20 text-purple-300'
                  }`}>
                    {getStatusText(message.status)}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openReplyToMessage(message);
                      }}
                      className="p-1 text-cyan-400 hover:text-cyan-300"
                      title="Répondre"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    {message.status === 'unread' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(message.id);
                        }}
                        className="p-1 text-blue-400 hover:text-blue-300"
                        title="Marquer comme lu"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {message.status === 'read' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsReplied(message.id);
                        }}
                        className="p-1 text-purple-400 hover:text-purple-300"
                        title="Marquer comme répondu"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMessage(message.id);
                      }}
                      className="p-1 text-red-400 hover:text-red-300"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Détails du message</h3>
          {selectedMessage ? (
            <div ref={replyFormRef} className="bg-surface-dark border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <h4 className="font-semibold text-white">{selectedMessage.name}</h4>
                    <p className="text-sm text-gray-400">{selectedMessage.email}</p>
                  </div>
                </div>
                <button
                  onClick={cancelReply}
                  className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-600 rounded-lg text-xs text-gray-300 hover:bg-gray-700"
                >
                  <span role="img" aria-label="Fermer">✕</span>
                  Fermer
                </button>
              </div>

              {selectedMessage.subject && (
                <div className="mb-4">
                  <h5 className="font-medium text-primary mb-1">Sujet</h5>
                  <p className="text-white">{selectedMessage.subject}</p>
                </div>
              )}

              <div className="mb-2">
                <h5 className="font-medium text-primary mb-1">Source</h5>
                <p className="text-amber-300 uppercase text-xs font-bold">{getSourceLabel(selectedMessage.source)}</p>
              </div>

              <div className="mb-4">
                <h5 className="font-medium text-primary mb-1">Message</h5>
                <div className="bg-gray-800 rounded p-3">
                  <p className="text-gray-200 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Reçu le {formatDate(selectedMessage.created_at)}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  selectedMessage.status === 'unread' ? 'bg-blue-500/20 text-blue-300' :
                  selectedMessage.status === 'read' ? 'bg-green-500/20 text-green-300' :
                  'bg-purple-500/20 text-purple-300'
                }`}>
                  {getStatusText(selectedMessage.status)}
                </span>
              </div>

              {selectedMessage.read_at && (
                <div className="mt-2 text-xs text-gray-500">
                  Lu le {formatDate(selectedMessage.read_at)}
                </div>
              )}

              <div className="mt-4 space-y-2">
                <label className="block text-sm font-medium text-gray-300">Sujet de la réponse</label>
                <input
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  placeholder="Sujet de la réponse"
                  className="w-full rounded-lg border border-gray-600 bg-surface-dark px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                />
                <label className="block text-sm font-medium text-gray-300">Message de réponse</label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Écrire votre message ici"
                  className="w-full rounded-lg border border-gray-600 bg-surface-dark px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                  rows={4}
                />
                {replyStatus === 'sent' && <p className="text-sm text-green-400">Réponse envoyée avec succès.</p>}
                {replyStatus === 'error' && <p className="text-sm text-red-400">Échec de l'envoi. Vérifiez vos champs / votre configuration mail.</p>}
                <button
                  onClick={sendReply}
                  disabled={replySending}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60"
                >
                  {replySending ? 'Envoi...' : 'Envoyer la réponse'}
                </button>
              </div>

              <div className="flex gap-2 mt-4">
                {selectedMessage.status === 'unread' && (
                  <button
                    onClick={() => markAsRead(selectedMessage.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Marquer comme lu
                  </button>
                )}
                {selectedMessage.status === 'read' && (
                  <button
                    onClick={() => markAsReplied(selectedMessage.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Marquer comme répondu
                  </button>
                )}
                <button
                  onClick={() => deleteMessage(selectedMessage.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-surface-dark border border-gray-700 rounded-lg p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Sélectionnez un message pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
        </>
      )}
    </div>
  );
}