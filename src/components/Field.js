import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { pick, isCancel } from '@react-native-documents/picker';
import * as ImagePicker from 'react-native-image-picker';
import {
  getUploadedDocument,
  postUploadDocument,
  postComment,
  getComment,
} from '../api/surveyForm';

export default function Field({ field, partId, formId, surveyId, buildingId }) {
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState(null);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comment, setComment] = useState(null);
  const [hasDocument, setHasDocument] = useState(false);

  // 📁 Pick & upload a file
  async function pickDocument(fieldId) {
    try {
      setLoading(true);
      setLoadingType('upload');
      const [res] = await pick({ type: ['*/*'] });

      await postUploadDocument(
        res,
        surveyId,
        buildingId,
        formId,
        partId,
        fieldId,
      );

      const result = await getUploadedDocument(
        surveyId,
        formId,
        partId,
        fieldId,
      );

      setHasDocument(result?.data?.documents?.length > 0);
      Alert.alert('Success', 'File uploaded successfully');
    } catch (err) {
      if (!isCancel(err)) console.error(err);
      Alert.alert('Error', 'File upload failed');
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  }

  // 📸 Capture & upload a photo
  async function openCamera(fieldId) {
    try {
      setLoading(true);
      setLoadingType('camera');

      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setLoading(false);
          setLoadingType(null);
          return;
        }
      }

      ImagePicker.launchCamera(
        { mediaType: 'photo', includeBase64: false, saveToPhotos: true },
        async response => {
          if (response.didCancel || response.errorMessage) {
            setLoading(false);
            setLoadingType(null);
            return;
          }

          if (response.assets?.length > 0) {
            await postUploadDocument(
              response.assets[0],
              surveyId,
              buildingId,
              formId,
              partId,
              fieldId,
            );

            const result = await getUploadedDocument(
              surveyId,
              formId,
              partId,
              fieldId,
            );

            setHasDocument(result?.data?.documents?.length > 0);
            Alert.alert('Success', 'Photo uploaded successfully');
          }
          setLoading(false);
          setLoadingType(null);
        },
      );
    } catch (err) {
      console.warn(err);
      Alert.alert('Error', 'Something went wrong');
      setLoading(false);
      setLoadingType(null);
    }
  }

  // 💬 Post or update a comment
  async function handleComment(fieldId) {
    if (!commentText.trim()) {
      Alert.alert('Comment required', 'Please enter a comment before posting.');
      return;
    }

    try {
      setLoading(true);
      setLoadingType('comment');
      const result = await postComment(
        surveyId,
        buildingId,
        formId,
        partId,
        fieldId,
        commentText,
      );

      const updatedComment = {
        text: commentText,
        createdAt: new Date().toISOString(),
        _id: result?.comment?._id || comment?._id || Date.now().toString(),
      };
      setComment(updatedComment);
      setCommentText('');
      setShowCommentInput(false);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to post comment');
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  }

  // 📤 Fetch documents & comments
  async function handleUploadedDocument(fieldId) {
    try {
      const docResult = await getUploadedDocument(
        surveyId,
        formId,
        partId,
        fieldId,
      );
      setHasDocument(docResult?.data?.documents?.length > 0);

      // 🗨️ Fetch comment and pre-fill it
      const commentResult = await getComment(
        surveyId,
        buildingId,
        formId,
        partId,
        fieldId,
      );

      if (commentResult?.data?.length > 0) {
        const fetchedComment = commentResult.data[0];
        setComment({
          text: fetchedComment.comment,
          createdAt: fetchedComment.createdAt,
        });
      }
    } catch (err) {
      console.error(err);
      setHasDocument(false);
    }
  }

  useEffect(() => {
    handleUploadedDocument(field._id);
  }, []);

  // ✏️ Pre-fill text when editing comment
  const handleEditPress = () => {
    if (comment?.text) {
      setCommentText(comment.text);
    }
    setShowCommentInput(true);
  };

  return (
    <View style={styles.field}>
      <View style={styles.labelRow}>
        <Icon
          name={hasDocument ? 'check-circle' : 'x-circle'}
          size={20}
          color={hasDocument ? '#28a745' : '#a72828'}
          style={{ marginHorizontal: 6 }}
        />
        <Text style={styles.label}>{field.name}</Text>
      </View>

      {/* 📁 Upload & 📸 Capture */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => pickDocument(field._id)}
          disabled={loading && loadingType === 'upload'}
        >
          {loading && loadingType === 'upload' ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Icon name="upload" size={18} color="#fff" style={styles.icon} />
              <Text style={styles.buttonText}>Upload File</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => openCamera(field._id)}
          disabled={loading && loadingType === 'camera'}
        >
          {loading && loadingType === 'camera' ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Icon name="camera" size={18} color="#fff" style={styles.icon} />
              <Text style={styles.buttonText}>Capture Photo</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* 💬 Comment Button */}
      <TouchableOpacity
        style={[styles.button, styles.addCommentbtn]}
        onPress={showCommentInput ? () => handleComment(field._id) : handleEditPress}
        disabled={loading && loadingType === 'comment'}
      >
        {loading && loadingType === 'comment' ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Icon
              name={showCommentInput ? 'save' : 'edit'}
              size={18}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>
              {showCommentInput
                ? comment
                  ? 'Update Comment'
                  : 'Post Comment'
                : comment
                ? 'Edit Comment'
                : 'Add Comment'}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* 📝 Editable Comment Input */}
      {showCommentInput && (
        <TextInput
          style={styles.commentInput}
          placeholder="Type your comment..."
          value={commentText}
          onChangeText={setCommentText}
          multiline
        />
      )}

      {/* 💬 Display Existing Comment */}
      {comment && !showCommentInput && (
        <View style={styles.commentBox}>
          <Text style={styles.commentLabel}>Comment:</Text>
          <Text style={styles.commentText}>{comment.text}</Text>
          <Text style={styles.commentDate}>
            Last updated: {new Date(comment.createdAt).toLocaleString()}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 22,
    paddingHorizontal: 4,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2A5D9F',
    width: 290,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1ABC9C',
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 2,
  },
  secondaryButton: {
    backgroundColor: '#8D83FF',
  },
  addCommentbtn: {
    backgroundColor: '#34495E',
    marginTop: 10,
  },
  icon: {
    marginRight: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  commentInput: {
    marginTop: 10,
    backgroundColor: '#f0f4f8',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#d0d7de',
  },
  commentBox: {
    marginTop: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e0e6ed',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  commentLabel: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#2A5D9F',
    fontSize: 15,
  },
  commentText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 6,
    lineHeight: 20,
  },
  commentDate: {
    fontSize: 12,
    color: '#888',
  },
});
