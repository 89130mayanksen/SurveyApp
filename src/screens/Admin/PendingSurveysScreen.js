import React, { useEffect, useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { getAllPendingSurveys } from '../../api/admin';

// if (
//   Platform.OS === 'android' &&
//   UIManager.setLayoutAnimationEnabledExperimental
// ) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

export default function PendingSurveysScreen() {
  const [pendingData, setPendingData] = useState([]); // [{ user, pendingSurveys }]
  const [expandedSurveyIndex, setExpandedSurveyIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchPendingSurveys();
  }, []);

  const fetchPendingSurveys = async () => {
    try {
      const result = await getAllPendingSurveys();
      setPendingData(result?.data || []);
    } catch (error) {
      console.error("❌ Error fetching pending surveys:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSurveyExpand = useCallback(
    (surveyIndex) => {
      setExpandedSurveyIndex(
        expandedSurveyIndex === surveyIndex ? null : surveyIndex
      );
    },
    [expandedSurveyIndex]
  );

  const handleSurveyPress = useCallback(
    (survey) =>
      navigation.navigate("SurveyDetailScreen", { survey, user: null }),
    [navigation]
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (!pendingData.length) {
    return (
      <View style={styles.noData}>
        <Text style={styles.noDataText}>No pending surveys available.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={pendingData}
      keyExtractor={(item) => item.user._id}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      renderItem={({ item: userGroup }) => (
        <View style={styles.userCard}>
          {/* Parent Card: User Info */}
          <View style={styles.userHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
              <Icon name="user" size={20} color="#0284C7" />
              <Text style={styles.userName}>{userGroup.user.name}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
              <Icon name="mail" size={16} color="#6B7280" />
              <Text style={styles.userEmail}>{userGroup.user.email}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name="phone" size={16} color="#6B7280" />
              <Text style={styles.userPhone}>{userGroup.user.phone}</Text>
            </View>
          </View>

          {/* Child: User's Pending Surveys */}
          {userGroup.pendingSurveys.map((survey, index) => {
            const isExpanded = expandedSurveyIndex === survey.surveyId;
            return (
              <View key={survey.surveyId} style={styles.surveyCard}>
                <TouchableOpacity
                  style={styles.headerRow}
                  onPress={() => toggleSurveyExpand(survey.surveyId)}
                >
                  <Icon name="home" size={22} color="#4A90E2" />
                  <Text style={styles.buildingName}>
                    {survey.building?.building_name || "Unnamed Building"}
                  </Text>
                  <Icon
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.expandedContainer}>
                    <View style={styles.infoRow}>
                      <Icon name="map-pin" size={16} color="#64748B" />
                      <Text style={styles.infoText}>
                        {survey.building?.location_address || "Unknown Location"}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Icon name="calendar" size={16} color="#64748B" />
                      <Text style={styles.infoText}>
                        Created: {new Date(survey.createdAt).toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.formRow}>
                      <Icon name="clipboard" size={16} color="#fff" />
                      <Text style={styles.formBadge}>{survey.forms?.length || 0} Forms</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.detailButton}
                      onPress={() => handleSurveyPress(survey)}
                    >
                      <Text style={styles.detailButtonText}>Open Survey Details</Text>
                      <Icon name="arrow-right" size={16} color="#fff" style={{ marginLeft: 6 }} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}
    />
  );
}


/** ✅ Memoized Card Component for better performance */
const Card = ({
  item,
  index,
  expandedIndex,
  toggleExpand,
  handleSurveyPress,
}) => {
  const isExpanded = expandedIndex === index;

  return (
    <View style={styles.surveyCard}>
      {/* Header Row */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => toggleExpand(index)}
        style={styles.headerRow}
      >
        <Icon name="home" size={22} color="#4A90E2" />
        <Text style={styles.buildingName}>
          {item?.building?.building_name || 'Unnamed Building'}
        </Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {item?.building?.category || 'N/A'}
          </Text>
        </View>
        <Icon
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#6B7280"
          style={{ marginLeft: 8 }}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.expandedContainer}>
          <View style={styles.infoRow}>
            <Icon name="map-pin" size={16} color="#64748B" />
            <Text style={styles.infoText}>
              {item?.building?.location_address || 'Unknown Location'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="calendar" size={16} color="#64748B" />
            <Text style={styles.infoText}>
              Created: {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>

          <View style={styles.formRow}>
            <Icon name="clipboard" size={16} color="#fff" />
            <Text style={styles.formBadge}>
              {item?.forms?.length || 0} Forms
            </Text>
          </View>

          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => handleSurveyPress(item)}
          >
            <Text style={styles.detailButtonText}>Open Survey Details</Text>
            <Icon
              name="arrow-right"
              size={16}
              color="#fff"
              style={{ marginLeft: 6 }}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const MemoizedCard = memo(Card);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 14,
    backgroundColor: "#F8FAFC",
  },
  userCard: {
    marginBottom: 20,
    backgroundColor: "#E0F2FE",
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  userHeader: {
    marginBottom: 10,
  },
  userName: { fontSize: 16, fontWeight: "700", color: "#0284C7", marginLeft: 6 },
  userEmail: { fontSize: 14, color: "#1E293B", marginLeft: 6 },
  userPhone: { fontSize: 14, color: "#1E293B", marginLeft: 6 },

  surveyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  buildingName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginLeft: 8,
  },
  expandedContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#475569",
    marginLeft: 6,
  },
  formRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#4A90E2",
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  formBadge: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  detailButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 12,
  },
  detailButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  noData: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  noDataText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
});
