import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { getAllNotification, acceptNotification, rejectNotification } from "../../api/admin";

export default function RequestsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const result = await getAllNotification();
      setNotifications(result?.data || []);
    } catch (error) {
      console.error("❌ Error fetching notifications:", error);
      Alert.alert("Error", "Failed to fetch requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (userId) => {
    try {
      await acceptNotification(userId);
      Alert.alert("Success", "Request approved successfully.");
      fetchNotifications();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to approve request.");
    }
  };

  const handleReject = async (userId) => {
    try {
      await rejectNotification(userId);
      Alert.alert("Success", "Request rejected successfully.");
      fetchNotifications();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to reject request.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Sender Info */}
      <View style={styles.headerRow}>
        <Icon name="user" size={20} color="#4A90E2" />
        <Text style={styles.senderName}>{item.senderId?.name}</Text>
      </View>
      <View style={styles.infoRow}>
        <Icon name="mail" size={16} color="#6B7280" />
        <Text style={styles.email}>{item.senderId?.email}</Text>
      </View>

      {/* Message */}
      <Text style={styles.message}>{item.message}</Text>

      {/* Date */}
      <View style={styles.footerRow}>
        <Icon name="clock" size={16} color="#6B7280" />
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.approveBtn}
          onPress={() => handleAccept(item.senderId._id)}
        >
          <Icon name="check" size={18} color="#fff" />
          <Text style={styles.approveText}>Approve</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.rejectBtn}
          onPress={() => handleReject(item.senderId._id)}
        >
          <Icon name="x" size={18} color="#fff" />
          <Text style={styles.rejectText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!notifications.length) {
    return (
      <View style={styles.noData}>
        <Text style={styles.noDataText}>No pending requests.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.screenTitle}>Signup Requests</Text> */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  senderName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  email: {
    fontSize: 15,
    color: "#6B7280",
    marginLeft: 6,
  },
  message: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 10,
    marginTop: 4,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  date: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 6,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  approveBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    backgroundColor: "#22C55E",
    paddingVertical: 10,
    borderRadius: 8,
  },
  approveText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    marginLeft: 6,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    backgroundColor: "#EF4444",
    paddingVertical: 10,
    borderRadius: 8,
  },
  rejectText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    marginLeft: 6,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noData: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
});
