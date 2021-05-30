import 'dart:html';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class ClaimToken extends StatelessWidget {
  const ClaimToken({
    Key? key,
    required String eventName,
    required String imageUrl,
  })  : _imageUrl = imageUrl,
        _eventName = eventName,
        super(key: key);

  final String _imageUrl;
  final String _eventName;
  final _tokenUrl = "http://POAP.xyz/claim/lkunyi";

  Future<void> _claimToken() async {
    window.open(_tokenUrl, 'POAP');
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 500,
      width: 500,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            _eventName,
            style: TextStyle(fontSize: 30),
          ),
          Container(
            padding: EdgeInsets.all(10),
            child: Image.network(
              _imageUrl,
              fit: BoxFit.contain,
            ),
          ),
          TextButton(
            onPressed: _claimToken,
            child: Text(
              'Claim Token!',
              style: TextStyle(
                fontSize: 20,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
