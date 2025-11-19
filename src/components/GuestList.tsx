import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle2, User } from 'lucide-react';
import type { Rsvp } from '../App';

interface GuestListProps {
  guests: Rsvp[];
}

export function GuestList({ guests }: GuestListProps) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 shadow-xl">
      <CardHeader>
        <CardTitle className="text-purple-900">Guest Responses</CardTitle>
      </CardHeader>
      <CardContent>
        {guests.length === 0 ? (
          <div className="text-center py-8 text-purple-600">
            <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No responses yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {guests.map((rsvp) => (
              <div
                key={rsvp.id}
                className="p-3 rounded-lg bg-white border border-purple-100 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-purple-900">{rsvp.name}</p>
                      <p className="text-purple-600 mt-1">🍹 {rsvp.drinks}</p>
                      {rsvp.paymentReceiptUrl && (
                        <p className="text-purple-600 mt-1 text-sm">✓ Receipt uploaded</p>
                      )}
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-600">
                    Attending
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
