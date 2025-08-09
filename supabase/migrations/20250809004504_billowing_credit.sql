/*
  # Données d'exemple pour le portail étudiant

  1. Utilisateurs de test
  2. Cours et inscriptions
  3. Notes d'exemple
  4. Devoirs et soumissions
  5. Emploi du temps
  6. Certifications
  7. Documents de bibliothèque
  8. Messages de chat
*/

-- Insérer des profils d'exemple (simuler des utilisateurs authentifiés)
INSERT INTO profiles (id, email, full_name, role, promotion, department, avatar_url) VALUES
  ('11111111-1111-1111-1111-111111111111', 'student@example.com', 'Djeukeng Kana', 'student', 'L3 RT', null, 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2'),
  ('22222222-2222-2222-2222-222222222222', 'teacher@example.com', 'Prof. Martin Dubois', 'teacher', null, 'Informatique', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2'),
  ('33333333-3333-3333-3333-333333333333', 'admin@example.com', 'Admin Système', 'admin', null, null, 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2'),
  ('44444444-4444-4444-4444-444444444444', 'marie.dubois@example.com', 'Marie Dubois', 'student', 'L3 RT', null, 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2'),
  ('55555555-5555-5555-5555-555555555555', 'pierre.martin@example.com', 'Pierre Martin', 'student', 'L3 RT', null, 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2'),
  ('66666666-6666-6666-6666-666666666666', 'prof.bernard@example.com', 'Prof. Bernard', 'teacher', null, 'Informatique', 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2');

-- Insérer des cours
INSERT INTO courses (id, name, code, description, teacher_id, promotion, coefficient) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Algorithmique Avancée', 'ALGO301', 'Cours d''algorithmique avancée', '22222222-2222-2222-2222-222222222222', 'L3 RT', 3),
  ('c2222222-2222-2222-2222-222222222222', 'Base de Données', 'BDD301', 'Conception et gestion de bases de données', '66666666-6666-6666-6666-666666666666', 'L3 RT', 2),
  ('c3333333-3333-3333-3333-333333333333', 'Programmation Web', 'WEB301', 'Développement d''applications web', '22222222-2222-2222-2222-222222222222', 'L3 RT', 4),
  ('c4444444-4444-4444-4444-444444444444', 'Réseaux', 'NET301', 'Administration et sécurité des réseaux', '66666666-6666-6666-6666-666666666666', 'L3 RT', 2),
  ('c5555555-5555-5555-5555-555555555555', 'Intelligence Artificielle', 'IA301', 'Introduction à l''IA et machine learning', '22222222-2222-2222-2222-222222222222', 'L3 RT', 3);

-- Insérer des inscriptions
INSERT INTO enrollments (student_id, course_id) VALUES
  ('11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111'),
  ('11111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222'),
  ('11111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333'),
  ('11111111-1111-1111-1111-111111111111', 'c4444444-4444-4444-4444-444444444444'),
  ('11111111-1111-1111-1111-111111111111', 'c5555555-5555-5555-5555-555555555555'),
  ('44444444-4444-4444-4444-444444444444', 'c1111111-1111-1111-1111-111111111111'),
  ('44444444-4444-4444-4444-444444444444', 'c2222222-2222-2222-2222-222222222222'),
  ('55555555-5555-5555-5555-555555555555', 'c1111111-1111-1111-1111-111111111111'),
  ('55555555-5555-5555-5555-555555555555', 'c3333333-3333-3333-3333-333333333333');

-- Insérer des notes
INSERT INTO grades (student_id, course_id, value, coefficient, grade_type, date_obtained) VALUES
  ('11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 16.0, 3, 'examen', '2024-01-15'),
  ('11111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222', 14.0, 2, 'controle', '2024-01-10'),
  ('11111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333', 18.0, 4, 'tp', '2024-01-20'),
  ('11111111-1111-1111-1111-111111111111', 'c4444444-4444-4444-4444-444444444444', 12.0, 2, 'controle', '2024-01-08'),
  ('11111111-1111-1111-1111-111111111111', 'c5555555-5555-5555-5555-555555555555', 15.0, 3, 'examen', '2024-01-25'),
  ('44444444-4444-4444-4444-444444444444', 'c1111111-1111-1111-1111-111111111111', 17.5, 3, 'examen', '2024-01-15'),
  ('44444444-4444-4444-4444-444444444444', 'c2222222-2222-2222-2222-222222222222', 13.5, 2, 'controle', '2024-01-10');

-- Insérer des devoirs
INSERT INTO assignments (id, title, description, course_id, teacher_id, promotion, max_points, due_date) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Projet Base de Données', 'Conception et implémentation d''une base de données pour un système de gestion de bibliothèque', 'c2222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666', 'L3 RT', 20, '2024-02-15 23:59:00'),
  ('a2222222-2222-2222-2222-222222222222', 'TP Algorithmique', 'Implémentation d''algorithmes de tri et analyse de complexité', 'c1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'L3 RT', 15, '2024-02-10 23:59:00'),
  ('a3333333-3333-3333-3333-333333333333', 'Site Web Responsive', 'Création d''un site web responsive avec HTML, CSS et JavaScript', 'c3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'L3 RT', 18, '2024-02-20 23:59:00');

-- Insérer des soumissions
INSERT INTO submissions (assignment_id, student_id, files, comments, grade, feedback, status, graded_at) VALUES
  ('a1111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', '[{"name": "projet_bdd.pdf", "size": 2048576, "type": "application/pdf"}]', 'Voici mon projet de base de données avec la documentation complète.', 17.0, 'Excellent travail, très bien documenté.', 'graded', now()),
  ('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '[{"name": "algorithmes.py", "size": 1024000, "type": "text/python"}]', 'Implémentation des algorithmes demandés.', null, null, 'submitted', null);

-- Insérer l'emploi du temps
INSERT INTO schedule_items (course_id, promotion, date, start_time, end_time, room, type) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'L3 RT', CURRENT_DATE, '08:00', '10:00', 'A101', 'cours'),
  ('c2222222-2222-2222-2222-222222222222', 'L3 RT', CURRENT_DATE, '10:15', '12:15', 'B205', 'tp'),
  ('c3333333-3333-3333-3333-333333333333', 'L3 RT', CURRENT_DATE, '14:00', '16:00', 'C301', 'cours'),
  ('c4444444-4444-4444-4444-444444444444', 'L3 RT', CURRENT_DATE + 1, '08:00', '09:30', 'A203', 'td'),
  ('c5555555-5555-5555-5555-555555555555', 'L3 RT', CURRENT_DATE + 1, '10:00', '12:00', 'D102', 'cours');

-- Insérer des demandes
INSERT INTO requests (student_id, type, subject, description, status, admin_response) VALUES
  ('11111111-1111-1111-1111-111111111111', 'note_error', 'Erreur dans la note d''algorithmique', 'Ma note d''examen d''algorithmique semble incorrecte. J''ai obtenu 16/20 mais le système affiche 12/20.', 'pending', null),
  ('44444444-4444-4444-4444-444444444444', 'schedule_conflict', 'Conflit d''emploi du temps', 'J''ai deux cours programmés en même temps le mardi matin.', 'resolved', 'Le conflit a été résolu. Votre emploi du temps a été mis à jour.');

-- Insérer des certifications
INSERT INTO certifications (id, title, description, instructor_id, duration, level, category, total_lessons, rating, enrolled_count) VALUES
  ('cert1111-1111-1111-1111-111111111111', 'Développement Web Full Stack', 'Maîtrisez React, Node.js, et les bases de données pour devenir développeur full stack', '22222222-2222-2222-2222-222222222222', '40h', 'intermédiaire', 'web', 20, 4.8, 156),
  ('cert2222-2222-2222-2222-222222222222', 'Science des Données avec Python', 'Apprenez l''analyse de données, machine learning et visualisation avec Python', '66666666-6666-6666-6666-666666666666', '35h', 'avancé', 'data', 15, 4.9, 89),
  ('cert3333-3333-3333-3333-333333333333', 'Développement Mobile avec React Native', 'Créez des applications mobiles cross-platform avec React Native', '22222222-2222-2222-2222-222222222222', '30h', 'intermédiaire', 'mobile', 12, 4.6, 124),
  ('cert4444-4444-4444-4444-444444444444', 'Cybersécurité et Ethical Hacking', 'Découvrez les techniques de sécurité informatique et de test de pénétration', '66666666-6666-6666-6666-666666666666', '45h', 'avancé', 'security', 18, 4.7, 67);

-- Insérer des inscriptions aux certifications
INSERT INTO certification_enrollments (student_id, certification_id, progress, completed_lessons, certificate_earned) VALUES
  ('11111111-1111-1111-1111-111111111111', 'cert1111-1111-1111-1111-111111111111', 65, 13, false),
  ('11111111-1111-1111-1111-111111111111', 'cert2222-2222-2222-2222-222222222222', 100, 15, true);

-- Insérer des documents de bibliothèque
INSERT INTO library_documents (title, description, author_id, file_type, file_size, category, tags, downloads, rating) VALUES
  ('Rapport de Stage - Développement Web', 'Rapport de stage de 6 mois chez une startup tech, focus sur React et Node.js', '44444444-4444-4444-4444-444444444444', 'pdf', 2621440, 'rapport', ARRAY['stage', 'web', 'react', 'nodejs'], 45, 4.8),
  ('Projet Base de Données - Système de Gestion', 'Projet complet avec code source, documentation et base de données', '55555555-5555-5555-5555-555555555555', 'archive', 15728640, 'projet', ARRAY['bdd', 'mysql', 'php', 'projet'], 32, 4.5),
  ('Cours Algorithmique Avancée', 'Support de cours complet avec exercices corrigés', '22222222-2222-2222-2222-222222222222', 'pdf', 9175040, 'cours', ARRAY['algorithmique', 'cours', 'exercices'], 128, 4.9),
  ('Exercices Corrigés - Programmation C++', 'Collection d''exercices avec solutions détaillées', '22222222-2222-2222-2222-222222222222', 'doc', 1887436, 'exercice', ARRAY['cpp', 'exercices', 'programmation'], 89, 4.7);

-- Insérer des messages de chat
INSERT INTO chat_messages (user_id, promotion, content, is_pinned) VALUES
  ('44444444-4444-4444-4444-444444444444', 'L3 RT', 'Salut tout le monde ! Est-ce que quelqu''un a les notes du cours d''algorithmique d''hier ?', false),
  ('55555555-5555-5555-5555-555555555555', 'L3 RT', 'Oui, je peux les partager. Je les uploaderai dans la bibliothèque.', false),
  ('11111111-1111-1111-1111-111111111111', 'L3 RT', 'N''oubliez pas que le projet de base de données est à rendre vendredi !', true),
  ('44444444-4444-4444-4444-444444444444', 'L3 RT', 'Merci pour le rappel ! Quelqu''un veut former un groupe pour réviser ensemble ?', false);