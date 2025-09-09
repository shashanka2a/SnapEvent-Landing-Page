import { PrismaClient } from '@prisma/client'
import { UserRole, ApplicationStatus, BookingStatus, PaymentStatus, PaymentMethod, PortfolioCategory, MessageType, NotificationType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create specialties
  const specialties = await Promise.all([
    prisma.specialty.create({
      data: {
        name: 'Wedding Photography',
        description: 'Capturing your special day with beautiful, timeless photos',
        icon: '💒'
      }
    }),
    prisma.specialty.create({
      data: {
        name: 'Portrait Photography',
        description: 'Professional headshots and personal portraits',
        icon: '📸'
      }
    }),
    prisma.specialty.create({
      data: {
        name: 'Event Photography',
        description: 'Corporate events, parties, and special occasions',
        icon: '🎉'
      }
    }),
    prisma.specialty.create({
      data: {
        name: 'Corporate Photography',
        description: 'Business headshots and corporate events',
        icon: '💼'
      }
    }),
    prisma.specialty.create({
      data: {
        name: 'Fashion Photography',
        description: 'Editorial and commercial fashion photography',
        icon: '👗'
      }
    }),
    prisma.specialty.create({
      data: {
        name: 'Landscape Photography',
        description: 'Nature and scenic photography',
        icon: '🏔️'
      }
    }),
    prisma.specialty.create({
      data: {
        name: 'Product Photography',
        description: 'Commercial product and e-commerce photography',
        icon: '📦'
      }
    }),
    prisma.specialty.create({
      data: {
        name: 'Food Photography',
        description: 'Restaurant and culinary photography',
        icon: '🍽️'
      }
    })
  ])

  console.log('✅ Created specialties')

  // Create sample users (clients)
  const clients = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1 (555) 123-4567',
        role: UserRole.CLIENT
      }
    }),
    prisma.user.create({
      data: {
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+1 (555) 234-5678',
        role: UserRole.CLIENT
      }
    }),
    prisma.user.create({
      data: {
        email: 'mike.johnson@example.com',
        firstName: 'Mike',
        lastName: 'Johnson',
        phone: '+1 (555) 345-6789',
        role: UserRole.CLIENT
      }
    })
  ])

  console.log('✅ Created client users')

  // Create photographer users and profiles
  const photographer1 = await prisma.user.create({
    data: {
      email: 'sarah.chen@example.com',
      firstName: 'Sarah',
      lastName: 'Chen',
      phone: '+1 (415) 555-0123',
      role: UserRole.PHOTOGRAPHER,
      photographerProfile: {
        create: {
          businessName: 'Sarah Chen Photography',
          title: 'Wedding & Portrait Photographer',
          bio: 'Passionate photographer specializing in capturing authentic moments and emotions. With over 8 years of experience, I focus on creating timeless images that tell your unique story.',
          location: 'San Francisco, CA',
          website: 'sarahchen.photography',
          portfolioUrl: 'snapevent.com/sarah-chen',
          instagramHandle: '@sarahchenphoto',
          yearsExperience: 8,
          isVerified: true,
          isAvailable: true,
          responseTime: '< 2 hours',
          totalClients: 450,
          averageRating: 4.9,
          totalReviews: 127,
          profileImage: 'https://images.unsplash.com/photo-1643968612613-fd411aecd1fd?w=400',
          applicationStatus: ApplicationStatus.APPROVED,
          approvedAt: new Date('2023-01-15')
        }
      }
    }
  })

  const photographer2 = await prisma.user.create({
    data: {
      email: 'alex.rodriguez@example.com',
      firstName: 'Alex',
      lastName: 'Rodriguez',
      phone: '+1 (212) 555-0456',
      role: UserRole.PHOTOGRAPHER,
      photographerProfile: {
        create: {
          businessName: 'Alex Rodriguez Studios',
          title: 'Corporate & Event Photographer',
          bio: 'Professional photographer with 12 years of experience in corporate events, product photography, and business headshots. Based in New York City.',
          location: 'New York, NY',
          website: 'alexrodriguez.photo',
          portfolioUrl: 'snapevent.com/alex-rodriguez',
          instagramHandle: '@alexrodriguezphoto',
          yearsExperience: 12,
          isVerified: true,
          isAvailable: true,
          responseTime: '< 4 hours',
          totalClients: 320,
          averageRating: 4.8,
          totalReviews: 89,
          profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          applicationStatus: ApplicationStatus.APPROVED,
          approvedAt: new Date('2022-11-20')
        }
      }
    }
  })

  const photographer3 = await prisma.user.create({
    data: {
      email: 'emma.wilson@example.com',
      firstName: 'Emma',
      lastName: 'Wilson',
      phone: '+1 (310) 555-0789',
      role: UserRole.PHOTOGRAPHER,
      photographerProfile: {
        create: {
          businessName: 'Emma Wilson Photography',
          title: 'Fashion & Portrait Photographer',
          bio: 'Creative fashion and portrait photographer based in Los Angeles. Specializing in editorial shoots, brand photography, and personal portraits.',
          location: 'Los Angeles, CA',
          website: 'emmawilson.photo',
          portfolioUrl: 'snapevent.com/emma-wilson',
          instagramHandle: '@emmawilsonphoto',
          yearsExperience: 6,
          isVerified: true,
          isAvailable: true,
          responseTime: '< 3 hours',
          totalClients: 280,
          averageRating: 4.7,
          totalReviews: 76,
          profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
          applicationStatus: ApplicationStatus.APPROVED,
          approvedAt: new Date('2023-03-10')
        }
      }
    }
  })

  console.log('✅ Created photographer users and profiles')

  // Get photographer profiles for relations
  const profiles = await prisma.photographerProfile.findMany({
    include: { user: true }
  })

  // Add specialties to photographers
  await Promise.all([
    // Sarah Chen - Wedding & Portrait
    prisma.photographerSpecialty.create({
      data: {
        photographerId: profiles[0].id,
        specialtyId: specialties[0].id // Wedding
      }
    }),
    prisma.photographerSpecialty.create({
      data: {
        photographerId: profiles[0].id,
        specialtyId: specialties[1].id // Portrait
      }
    }),
    // Alex Rodriguez - Corporate & Event
    prisma.photographerSpecialty.create({
      data: {
        photographerId: profiles[1].id,
        specialtyId: specialties[3].id // Corporate
      }
    }),
    prisma.photographerSpecialty.create({
      data: {
        photographerId: profiles[1].id,
        specialtyId: specialties[2].id // Event
      }
    }),
    // Emma Wilson - Fashion & Portrait
    prisma.photographerSpecialty.create({
      data: {
        photographerId: profiles[2].id,
        specialtyId: specialties[4].id // Fashion
      }
    }),
    prisma.photographerSpecialty.create({
      data: {
        photographerId: profiles[2].id,
        specialtyId: specialties[1].id // Portrait
      }
    })
  ])

  console.log('✅ Added specialties to photographers')

  // Create services for photographers
  await Promise.all([
    // Sarah Chen services
    prisma.service.create({
      data: {
        photographerId: profiles[0].id,
        name: 'Wedding Photography',
        description: 'Full wedding day coverage with 8+ hours of photography',
        price: 2500.00,
        duration: '8+ hours',
        deliverables: '500+ edited photos, online gallery, USB drive'
      }
    }),
    prisma.service.create({
      data: {
        photographerId: profiles[0].id,
        name: 'Engagement Session',
        description: 'Romantic engagement photo session',
        price: 400.00,
        duration: '2 hours',
        deliverables: '50+ edited photos, online gallery'
      }
    }),
    // Alex Rodriguez services
    prisma.service.create({
      data: {
        photographerId: profiles[1].id,
        name: 'Corporate Event Coverage',
        description: 'Professional corporate event photography',
        price: 800.00,
        duration: '4 hours',
        deliverables: '200+ edited photos, online gallery'
      }
    }),
    prisma.service.create({
      data: {
        photographerId: profiles[1].id,
        name: 'Business Headshots',
        description: 'Professional business headshots',
        price: 200.00,
        duration: '1 hour',
        deliverables: '10+ edited photos, online gallery'
      }
    }),
    // Emma Wilson services
    prisma.service.create({
      data: {
        photographerId: profiles[2].id,
        name: 'Fashion Editorial Shoot',
        description: 'Creative fashion photography session',
        price: 600.00,
        duration: '3 hours',
        deliverables: '100+ edited photos, online gallery'
      }
    }),
    prisma.service.create({
      data: {
        photographerId: profiles[2].id,
        name: 'Portrait Session',
        description: 'Personal portrait photography',
        price: 350.00,
        duration: '2 hours',
        deliverables: '40+ edited photos, online gallery'
      }
    })
  ])

  console.log('✅ Created services')

  // Create portfolio items
  await Promise.all([
    // Sarah Chen portfolio
    prisma.portfolioItem.create({
      data: {
        photographerId: profiles[0].id,
        title: 'Golden Hour Wedding',
        description: 'Beautiful outdoor wedding ceremony at sunset',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
        category: PortfolioCategory.WEDDING,
        tags: ['wedding', 'outdoor', 'sunset', 'ceremony'],
        isFeatured: true
      }
    }),
    prisma.portfolioItem.create({
      data: {
        photographerId: profiles[0].id,
        title: 'Couple Portrait Session',
        description: 'Romantic couple portraits in the park',
        imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
        category: PortfolioCategory.PORTRAIT,
        tags: ['portrait', 'couple', 'outdoor', 'romantic']
      }
    }),
    // Alex Rodriguez portfolio
    prisma.portfolioItem.create({
      data: {
        photographerId: profiles[1].id,
        title: 'Corporate Conference',
        description: 'Professional corporate event coverage',
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        category: PortfolioCategory.CORPORATE,
        tags: ['corporate', 'conference', 'business', 'professional']
      }
    }),
    prisma.portfolioItem.create({
      data: {
        photographerId: profiles[1].id,
        title: 'Business Headshot',
        description: 'Professional business headshot',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        category: PortfolioCategory.PORTRAIT,
        tags: ['headshot', 'business', 'professional', 'corporate']
      }
    }),
    // Emma Wilson portfolio
    prisma.portfolioItem.create({
      data: {
        photographerId: profiles[2].id,
        title: 'Fashion Editorial',
        description: 'Creative fashion photography',
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
        category: PortfolioCategory.FASHION,
        tags: ['fashion', 'editorial', 'creative', 'styling']
      }
    }),
    prisma.portfolioItem.create({
      data: {
        photographerId: profiles[2].id,
        title: 'Portrait Session',
        description: 'Artistic portrait photography',
        imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800',
        category: PortfolioCategory.PORTRAIT,
        tags: ['portrait', 'artistic', 'creative', 'personal']
      }
    })
  ])

  console.log('✅ Created portfolio items')

  // Create awards
  await Promise.all([
    prisma.award.create({
      data: {
        photographerId: profiles[0].id,
        title: 'Best Wedding Photographer 2023',
        organization: 'San Francisco Wedding Awards',
        year: 2023,
        description: 'Recognized for exceptional wedding photography'
      }
    }),
    prisma.award.create({
      data: {
        photographerId: profiles[1].id,
        title: 'Corporate Photography Excellence',
        organization: 'NYC Business Awards',
        year: 2022,
        description: 'Outstanding corporate event photography'
      }
    }),
    prisma.award.create({
      data: {
        photographerId: profiles[2].id,
        title: 'Fashion Photography Innovation',
        organization: 'LA Creative Awards',
        year: 2023,
        description: 'Innovative approach to fashion photography'
      }
    })
  ])

  console.log('✅ Created awards')

  // Create testimonials
  await Promise.all([
    prisma.testimonial.create({
      data: {
        photographerId: profiles[0].id,
        clientName: 'Michael & Sarah Johnson',
        clientEmail: 'michael.johnson@example.com',
        eventType: 'Wedding',
        rating: 5,
        comment: 'Sarah captured our wedding day perfectly! Her attention to detail and ability to capture candid moments made our photos absolutely stunning.',
        isApproved: true
      }
    }),
    prisma.testimonial.create({
      data: {
        photographerId: profiles[1].id,
        clientName: 'TechCorp Inc.',
        clientEmail: 'events@techcorp.com',
        eventType: 'Corporate Event',
        rating: 5,
        comment: 'Alex provided excellent coverage of our annual conference. Professional, punctual, and delivered high-quality photos that perfectly represented our brand.',
        isApproved: true
      }
    }),
    prisma.testimonial.create({
      data: {
        photographerId: profiles[2].id,
        clientName: 'Jessica Martinez',
        clientEmail: 'jessica.martinez@example.com',
        eventType: 'Portrait Session',
        rating: 5,
        comment: 'Emma made me feel so comfortable during our shoot. The photos turned out amazing and really captured my personality. Highly recommend!',
        isApproved: true
      }
    })
  ])

  console.log('✅ Created testimonials')

  // Create availability
  const today = new Date()
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  
  await Promise.all([
    prisma.availability.create({
      data: {
        photographerId: profiles[0].id,
        date: nextWeek,
        startTime: '09:00',
        endTime: '17:00',
        isAvailable: true
      }
    }),
    prisma.availability.create({
      data: {
        photographerId: profiles[1].id,
        date: nextWeek,
        startTime: '10:00',
        endTime: '18:00',
        isAvailable: true
      }
    }),
    prisma.availability.create({
      data: {
        photographerId: profiles[2].id,
        date: nextWeek,
        startTime: '11:00',
        endTime: '19:00',
        isAvailable: true
      }
    })
  ])

  console.log('✅ Created availability')

  // Create sample bookings
  const services = await prisma.service.findMany()
  
  const booking1 = await prisma.booking.create({
    data: {
      clientId: clients[0].id,
      photographerId: profiles[0].id,
      serviceId: services[0].id,
      eventType: 'Wedding',
      eventDate: new Date('2024-06-15'),
      eventLocation: 'Napa Valley, CA',
      duration: '8 hours',
      guestCount: 150,
      specialRequests: 'Outdoor ceremony, indoor reception',
      totalAmount: 2500.00,
      depositAmount: 500.00,
      isDepositPaid: true,
      status: BookingStatus.CONFIRMED
    }
  })

  const booking2 = await prisma.booking.create({
    data: {
      clientId: clients[1].id,
      photographerId: profiles[1].id,
      serviceId: services[2].id,
      eventType: 'Corporate Conference',
      eventDate: new Date('2024-05-20'),
      eventLocation: 'New York, NY',
      duration: '4 hours',
      guestCount: 200,
      specialRequests: 'Keynote speaker coverage, networking photos',
      totalAmount: 800.00,
      depositAmount: 200.00,
      isDepositPaid: true,
      status: BookingStatus.CONFIRMED
    }
  })

  console.log('✅ Created bookings')

  // Create payments
  await Promise.all([
    prisma.payment.create({
      data: {
        bookingId: booking1.id,
        amount: 500.00,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        status: PaymentStatus.COMPLETED,
        transactionId: 'txn_123456789',
        description: 'Wedding photography deposit'
      }
    }),
    prisma.payment.create({
      data: {
        bookingId: booking2.id,
        amount: 200.00,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        status: PaymentStatus.COMPLETED,
        transactionId: 'txn_987654321',
        description: 'Corporate event deposit'
      }
    })
  ])

  console.log('✅ Created payments')

  // Create reviews
  await Promise.all([
    prisma.review.create({
      data: {
        clientId: clients[0].id,
        photographerId: profiles[0].id,
        bookingId: booking1.id,
        rating: 5,
        title: 'Absolutely Amazing!',
        comment: 'Sarah exceeded all our expectations. The photos are beautiful and she made our wedding day so special.',
        isApproved: true,
        isPublic: true
      }
    }),
    prisma.review.create({
      data: {
        clientId: clients[1].id,
        photographerId: profiles[1].id,
        bookingId: booking2.id,
        rating: 5,
        title: 'Professional and Reliable',
        comment: 'Alex was professional, punctual, and delivered exactly what we needed for our corporate event.',
        isApproved: true,
        isPublic: true
      }
    })
  ])

  console.log('✅ Created reviews')

  // Create sample messages
  await Promise.all([
    prisma.message.create({
      data: {
        senderId: clients[0].id,
        receiverId: photographer1.id,
        bookingId: booking1.id,
        content: 'Hi Sarah! We\'re so excited about our wedding. Do you have any questions about the venue?',
        messageType: MessageType.TEXT
      }
    }),
    prisma.message.create({
      data: {
        senderId: photographer1.id,
        receiverId: clients[0].id,
        bookingId: booking1.id,
        content: 'Hi! Thank you for choosing me for your special day. I\'d love to schedule a call to discuss the timeline and any specific shots you\'d like.',
        messageType: MessageType.TEXT
      }
    })
  ])

  console.log('✅ Created messages')

  // Create search queries for analytics
  await Promise.all([
    prisma.searchQuery.create({
      data: {
        query: 'wedding photographer',
        location: 'San Francisco, CA',
        category: PortfolioCategory.WEDDING,
        resultsCount: 15
      }
    }),
    prisma.searchQuery.create({
      data: {
        query: 'corporate photographer',
        location: 'New York, NY',
        category: PortfolioCategory.CORPORATE,
        resultsCount: 8
      }
    }),
    prisma.searchQuery.create({
      data: {
        query: 'portrait photographer',
        location: 'Los Angeles, CA',
        category: PortfolioCategory.PORTRAIT,
        resultsCount: 12
      }
    })
  ])

  console.log('✅ Created search queries')

  // Create notifications
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: photographer1.id,
        title: 'New Booking Request',
        message: 'You have a new booking request for wedding photography',
        type: NotificationType.BOOKING_REQUEST,
        actionUrl: '/bookings'
      }
    }),
    prisma.notification.create({
      data: {
        userId: clients[0].id,
        title: 'Booking Confirmed',
        message: 'Your wedding photography booking has been confirmed',
        type: NotificationType.BOOKING_CONFIRMED,
        actionUrl: '/bookings'
      }
    })
  ])

  console.log('✅ Created notifications')

  console.log('🎉 Database seeding completed successfully!')
  console.log(`
📊 Summary:
- ${specialties.length} specialties created
- ${clients.length} client users created
- 3 photographer profiles created
- ${services.length} services created
- 6 portfolio items created
- 3 awards created
- 3 testimonials created
- 3 availability slots created
- 2 bookings created
- 2 payments created
- 2 reviews created
- 2 messages created
- 3 search queries created
- 2 notifications created
  `)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
