/// Roommate connection request model.
class RoommateRequest {
  final String id;
  final String senderId;
  final String recipientId;
  final String status; // 'pending', 'accepted', 'rejected'
  final String message;
  final DateTime createdAt;
  final DateTime updatedAt;

  const RoommateRequest({
    required this.id,
    required this.senderId,
    required this.recipientId,
    required this.status,
    this.message = '',
    required this.createdAt,
    required this.updatedAt,
  });

  RoommateRequest copyWith({
    String? id,
    String? senderId,
    String? recipientId,
    String? status,
    String? message,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return RoommateRequest(
      id: id ?? this.id,
      senderId: senderId ?? this.senderId,
      recipientId: recipientId ?? this.recipientId,
      status: status ?? this.status,
      message: message ?? this.message,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'sender_id': senderId,
      'recipient_id': recipientId,
      'status': status,
      'message': message,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  factory RoommateRequest.fromMap(Map<String, dynamic> map, String docId) {
    return RoommateRequest(
      id: docId,
      senderId: map['sender_id'] as String? ?? '',
      recipientId: map['recipient_id'] as String? ?? '',
      status: map['status'] as String? ?? 'pending',
      message: map['message'] as String? ?? '',
      createdAt: map['created_at'] != null
          ? DateTime.tryParse(map['created_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
      updatedAt: map['updated_at'] != null
          ? DateTime.tryParse(map['updated_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }
}
