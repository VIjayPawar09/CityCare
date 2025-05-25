import React, { useState } from 'react';
import { 
  Bell, 
  User, 
  LogOut,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  MapPin,
  Camera,
  FileText,
  Settings,
  TrendingUp,
  MessageSquare,
  ChevronRight,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Star,
  Award,
  Activity
} from 'lucide-react';

const CitizenDashboard = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock user data
  const user = {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    joinDate: "2023-05-15",
    reportsCount: 12,
    level: "Active Citizen",
    points: 340
  };

  const notifications = [
    { id: 1, type: 'resolved', message: 'Your pothole report on Main St has been resolved', time: '2 hours ago', unread: true },
    { id: 2, type: 'update', message: 'Streetlight repair is in progress', time: '1 day ago', unread: true },
    { id: 3, type: 'response', message: 'City responded to your park maintenance suggestion', time: '3 days ago', unread: false },
    { id: 4, type: 'event', message: 'Community meeting scheduled for next week', time: '5 days ago', unread: false }
  ];

  const myReports = [
    {
      id: 1,
      title: 'Pothole on Main Street',
      category: 'Roads',
      status: 'resolved',
      date: '2024-05-20',
      location: '123 Main St',
      priority: 'high',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
      description: 'Large pothole causing damage to vehicles',
      responses: 3
    },
    {
      id: 2,
      title: 'Broken Streetlight',
      category: 'Utilities',
      status: 'in-progress',
      date: '2024-05-18',
      location: '456 Oak Ave',
      priority: 'medium',
      description: 'Street light has been out for several days',
      responses: 1
    },
    {
      id: 3,
      title: 'Graffiti on Park Wall',
      category: 'Environment',
      status: 'pending',
      date: '2024-05-15',
      location: 'Central Park',
      priority: 'low',
      description: 'Vandalism on the north wall of the park',
      responses: 0
    },
    {
      id: 4,
      title: 'Illegal Dumping',
      category: 'Sanitation',
      status: 'resolved',
      date: '2024-05-10',
      location: '789 Pine St',
      priority: 'high',
      description: 'Large pile of construction debris dumped illegally',
      responses: 2
    }
  ];

  const quickActions = [
    { name: 'Report Issue', icon: Plus, color: 'bg-gradient-to-br from-red-500 to-pink-600' },
    { name: 'View Events', icon: Calendar, color: 'bg-gradient-to-br from-blue-500 to-indigo-600' },
    { name: 'Pay Bills', icon: FileText, color: 'bg-gradient-to-br from-green-500 to-teal-600' },
    { name: 'Contact Officials', icon: MessageSquare, color: 'bg-gradient-to-br from-purple-500 to-pink-600' }
  ];

  const recentActivity = [
    { type: 'report', message: 'Submitted pothole report', time: '2 days ago' },
    { type: 'response', message: 'Received response from Public Works', time: '4 days ago' },
    { type: 'resolved', message: 'Streetlight issue was resolved', time: '1 week ago' },
    { type: 'comment', message: 'Added comment to park maintenance report', time: '2 weeks ago' }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const filteredReports = myReports.filter(report => {
    const matchesFilter = activeFilter === 'all' || report.status === activeFilter;
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <span className="text-xl font-bold text-gray-800">City Care</span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg relative"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.filter(n => n.unread).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      {notifications.filter(n => n.unread).length}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map(notification => (
                        <div key={notification.id} className={`p-4 border-b hover:bg-gray-50 ${notification.unread ? 'bg-blue-50' : ''}`}>
                          <p className="text-sm text-gray-800">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.level}</p>
                </div>
                <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">Here's what's happening in your community today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-800">{user.reportsCount}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">
                  {myReports.filter(r => r.status === 'resolved').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {myReports.filter(r => r.status === 'in-progress').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Citizen Points</p>
                <p className="text-2xl font-bold text-purple-600">{user.points}</p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <button
                      key={index}
                      className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{action.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* My Reports */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">My Reports</h2>
                  <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                    <span>View All</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex space-x-2">
                    {['all', 'pending', 'in-progress', 'resolved'].map(filter => (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                          activeFilter === filter
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {filter === 'all' ? 'All' : filter.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="divide-y">
                {filteredReports.map(report => (
                  <div key={report.id} className="p-6 hover:bg-gray-50 group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-800">{report.title}</h3>
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(report.priority)}`}></div>
                          {getStatusIcon(report.status)}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{report.location}</span>
                          </span>
                          <span>{report.category}</span>
                          <span>{report.date}</span>
                        </div>

                        <p className="text-gray-600 text-sm mb-3">{report.description}</p>

                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                            {report.status.replace('-', ' ')}
                          </span>
                          
                          {report.responses > 0 && (
                            <span className="flex items-center space-x-1 text-xs text-gray-500">
                              <MessageSquare className="w-3 h-3" />
                              <span>{report.responses} responses</span>
                            </span>
                          )}

                          {report.image && (
                            <span className="flex items-center space-x-1 text-xs text-gray-500">
                              <Camera className="w-3 h-3" />
                              <span>Photo attached</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="text-center">
                <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full mx-auto mb-4" />
                <h3 className="font-semibold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{user.level}</p>
                
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg mb-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span className="font-semibold">{user.points} Points</span>
                  </div>
                  <p className="text-xs opacity-90 mt-1">Keep reporting to earn more!</p>
                </div>

                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Activity className="w-4 h-4" />
                <span>Recent Activity</span>
              </h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-gray-800">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Community Impact</span>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Issues Resolved This Month</span>
                  <span className="font-bold">127</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Active Citizens</span>
                  <span className="font-bold">1,234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Response Rate</span>
                  <span className="font-bold">96%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;